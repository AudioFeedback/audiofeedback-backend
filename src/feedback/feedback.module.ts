import { Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { PrismaService } from "src/prisma.service";
import { TracksService } from "src/tracks/tracks.service";

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService, TracksService],
})
export class FeedbackModule {}
