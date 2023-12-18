import { Module } from "@nestjs/common";
import { LabelsService } from "./labels.service";
import { LabelsController } from "./labels.controller";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "src/users/users.service";

@Module({
  controllers: [LabelsController],
  providers: [LabelsService, PrismaService, UsersService],
})
export class LabelsModule {}
