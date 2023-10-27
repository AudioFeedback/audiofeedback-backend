import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma.service';
import { Track, Prisma } from '@prisma/client';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TrackCreateInput): Promise<Track> {
    return this.prisma.track.create({data});
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} track`;
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }

  async getAudioFile(filename: string) {
    const rootDir = process.cwd();
    const mp3FilePath = join(rootDir, 'audio', filename);

    if (existsSync(mp3FilePath)) {
      return createReadStream(mp3FilePath);
    }
    return null;
  }

  async uploadAudioFile(file: Express.Multer.File): Promise<string> {
    const rootDir = process.cwd();
    const filePath = join(rootDir, 'audio', file.originalname);

    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    return filePath;
  }
}
