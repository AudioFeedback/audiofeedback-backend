import { Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService],
})
export class FeedbackModule {}
