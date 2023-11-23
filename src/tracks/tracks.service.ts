import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createWriteStream, readFileSync } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./dto/create-track.dto";
import { User } from "@prisma/client";
import * as mm from "music-metadata";

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async saveFile(file: Express.Multer.File) {
    const rootDir = process.cwd();

    const ext = path.extname(file.originalname);
    const filetype = ext.substring(1);

    const guid = uuidv4();
    const filePath = path.join(rootDir, "audio", `${guid}${ext}`);

    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    const duration = await this.getAudioDuration(file);

    return { filetype, guid, duration };
  }

  private async getAudioDuration(
    file: Express.Multer.File,
  ): Promise<number | undefined> {
    try {
      const metadata = await mm.parseBuffer(file.buffer, file.mimetype, {
        duration: true,
      });
      return metadata.format?.duration;
    } catch (error) {
      console.error("Error reading audio file metadata:", error.message);
      return undefined;
    }
  }

  async create(createTrackDto: CreateTrackDto, user: User) {
    const reviewerIds = this.csvStringToNumberedArray(
      createTrackDto.reviewerIds,
    );

    if (reviewerIds.length > 0) {
      this.throwErrorIfInvalidUsers(reviewerIds);

      return this.createWithReviewers(createTrackDto, user, reviewerIds);
    }

    return this.createWithoutReviewer(createTrackDto, user);
  }

  private async throwErrorIfInvalidUsers(reviewerIds: number[]) {
    const reviewers = await this.getReviewers();
    if (!reviewerIds.every((x) => reviewers.map((x) => x.id).includes(x))) {
      throw new NotFoundException(
        "Invalid user(s) or role specified for reviewers.",
      );
    }
  }

  private csvStringToNumberedArray(
    commaSeperatedArrayString: string | undefined,
  ) {
    if (commaSeperatedArrayString) {
      return commaSeperatedArrayString.split(",").map((x) => Number(x));
    }
    return [];
  }

  private async getReviewers() {
    return await this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
      },
    });
  }

  private async createWithReviewers(
    createTrackDto: CreateTrackDto,
    user: User,
    reviewerIds: number[],
  ) {
    return await this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        genre: createTrackDto.genre,
        author: {
          connect: { id: user.id },
        },
        reviewers: {
          connect: reviewerIds
            .map((x) => x)
            .map((id) => {
              return { id: id };
            }),
        },
      },
      include: {
        author: true,
        reviewers: true,
      },
    });
  }

  private async createWithoutReviewer(
    createTrackDto: CreateTrackDto,
    user: User,
  ) {
    return await this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        genre: createTrackDto.genre,
        author: {
          connect: { id: Number(user.id) },
        },
      },
      include: {
        author: true,
        reviewers: true,
      },
    });
  }

  async findAll(user: User) {
    return this.prisma.track.findMany({
      where: {
        OR: [{ authorId: user.id }],
      },
      include: {
        trackVersions: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.track.findUnique({
      where: { id: id },
    });
  }

  findOneTrackVersion(id: number) {
    return this.prisma.trackVersion.findUnique({
      where: { id: id },
    });
  }

  findOneDeep(id: number) {
    return this.prisma.track.findUnique({
      where: { id: id },
      include: {
        reviewers: true,
        trackVersions: {
          include: {
            feedback: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  findOneDeepReviewer(id: number, reviewer: User) {
    return this.prisma.track.findUnique({
      where: {
        id: id,
      },
      include: {
        trackVersions: {
          orderBy: {
            versionNumber: "desc",
          },
          take: 1,
          include: {
            feedback: {
              where: {
                user: {
                  id: reviewer.id,
                },
              },
            },
          },
        },
      },
    });
  }

  findAllVersions(id: number) {
    return this.prisma.track.findUnique({
      where: { id: id },
      include: {
        trackVersions: true,
      },
    });
  }

  update(id: number) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }

  async getAudioFile(filename: string) {
    const rootDir = process.cwd();
    const mp3FilePath = path.join(rootDir, "audio", filename);
    return readFileSync(mp3FilePath, null);
  }

  async getReviewable(user: User) {
    return this.prisma.track.findMany({
      include: {
        author: true,
      },
      where: {
        reviewers: {
          some: {
            id: user.id,
          },
        },
      },
    });
  }
}
