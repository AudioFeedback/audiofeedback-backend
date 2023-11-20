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
    const reviewers = await this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
      },
    });

    if (
      !createTrackDto.reviewerIds
        .split(",")
        .map((x) => Number(x))
        .every((x) => reviewers.map((x) => x.id).includes(x))
    ) {
      throw new NotFoundException(
        "Invalid user(s) or role specified for reviewers.",
      );
    }

    const reviewerIds = createTrackDto.reviewerIds.split(",")

    if(reviewerIds.length > 0) {
      return await this.prisma.track.create({
        data: {
          title: createTrackDto.title,
          genre: createTrackDto.genre,
          author: {
            connect: { id: Number(user.id) },
          },
          reviewers: {
            connect: reviewerIds
              .map((x) => Number(x))
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
    } else {
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
