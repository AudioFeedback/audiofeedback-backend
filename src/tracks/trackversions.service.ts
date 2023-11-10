import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

export interface TrackVersionData {
  id: number;
  guid: string;
  filetype: string;
  description: string;
  versionNumber: number;
}

@Injectable()
export class TrackVersionsService {
  constructor(private prisma: PrismaService) {}

  async create(track: TrackVersionData) {
    return await this.prisma.trackVersion.create({
      data: {
        guid: track.guid,
        filetype: track.filetype,
        description: track.description,
        versionNumber: track.versionNumber,
        track: {
          connect: { id: Number(track.id) },
        },
      },
    });
  }
}
