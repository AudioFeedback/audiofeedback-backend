import { Module } from "@nestjs/common";
import { TracksService } from "./tracks.service";
import { TracksController } from "./tracks.controller";
import { PrismaService } from "src/prisma.service";
import { TrackVersionsService } from "./trackversions.service";

@Module({
  controllers: [TracksController],
  providers: [TracksService, TrackVersionsService, PrismaService],
})
export class TracksModule {}
