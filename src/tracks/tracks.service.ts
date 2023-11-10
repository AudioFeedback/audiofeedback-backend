import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createWriteStream, readFileSync } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./dto/create-track.dto";
import { TrackWithAuthor } from "./dto/get-track-with-author.dto";
import { User } from "@prisma/client";
import { TrackWithAuthorAndFeedback } from "./dto/get-track-with-autor-and-feedback";

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTrackDto: CreateTrackDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<TrackWithAuthor> {
    const rootDir = process.cwd();

    const ext = path.extname(file.originalname);

    const guid = uuidv4();
    const filePath = path.join(rootDir, "audio", `${guid}${ext}`);

    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    return await this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        guid: guid,
        genre: createTrackDto.genre,
        author: {
          connect: { id: Number(user.id) },
        },
        filetype: ext.substring(1),
      },
      include: {
        author: true,
      },
    });
  }

  async findAll(user: User): Promise<TrackWithAuthorAndFeedback[]> {
    return this.prisma.track.findMany({
      where: {
        OR: [
          { authorId: user.id },
          {
            feedback: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      include: {
        author: true,
        feedback: {
          where: {
            userId: user.id,
          },
        },
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
