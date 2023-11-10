import { Injectable } from "@nestjs/common";
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

  async create(
    createTrackDto: CreateTrackDto,
    user: User,
  ): Promise<TrackWithAuthor> {
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
