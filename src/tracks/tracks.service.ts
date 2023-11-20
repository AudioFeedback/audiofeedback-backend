import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createWriteStream, readFileSync } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./dto/create-track.dto";
import { TrackWithAuthor } from "./dto/get-track-with-author.dto";
import { User } from "@prisma/client";

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

    return { filetype, guid };
  }

  async create(
    createTrackDto: CreateTrackDto,
    user: User,
  ): Promise<TrackWithAuthor> {
    const { reviewerIds, ...trackData } = createTrackDto;

    const reviewers = await this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
      },
    });

    if (reviewers.length !== reviewerIds.length) {
      throw new NotFoundException(
        "Invalid user(s) or role specified for reviewers.",
      );
    }

    return await this.prisma.track.create({
      data: {
        ...trackData,
        author: {
          connect: { id: Number(user.id) },
        },
        reviewers: {
          connect: reviewerIds.map((id) => Number(id)),
        },
      },
      include: {
        author: true,
      },
    });
  }

  async getReviewers() {
    return this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
      },
    });

    // const reviewerIds = reviewers.map((reviewer: User) => reviewer.id);

    // return reviewerIds;
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
}
