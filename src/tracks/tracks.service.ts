import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma.service';
import { Track, Prisma } from '@prisma/client';

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
}
