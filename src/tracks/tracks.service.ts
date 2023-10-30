import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Track } from "@prisma/client";
import { createWriteStream, readFileSync } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./dto/create-track.dto";
import { Request } from "express";
import { GetTrackDto } from "./dto/get-track.dto";

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTrackDto: CreateTrackDto,
    file: Express.Multer.File,
  ): Promise<Track> {
    const rootDir = process.cwd();

    const ext = path.extname(file.originalname);

    const guid = uuidv4();
    const filePath = path.join(rootDir, "audio", `${guid}${ext}`);

    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    const data = {
      title: createTrackDto.title,
      genre: createTrackDto.genre,
      guid: guid,
      filetype: ext.substring(1),
    };

    return this.prisma.track.create({ data });
  }

  async findAll(req: Request): Promise<GetTrackDto[]> {
    console.log(req.get("Host"));
    const tracks = await this.prisma.track.findMany();

    return tracks.map((x) => {
      return new GetTrackDto(
        x.id,
        x.title,
        x.genre,
        x.guid,
        x.filetype,
        `${req.get("Host")}/tracks/audio/${x.guid}.${x.filetype}`,
      );
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} track`;
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
