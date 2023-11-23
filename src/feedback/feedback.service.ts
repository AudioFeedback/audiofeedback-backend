import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { TrackVersion, User } from "@prisma/client";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
  async create(
    createFeedbackDto: CreateFeedbackDto,
    user: User,
    trackVersion: TrackVersion,
  ) {
    return await this.prisma.feedback.create({
      data: {
        rating: createFeedbackDto.rating,
        comment: createFeedbackDto.comment,
        timestamp: createFeedbackDto.timestamp,
        user: {
          connect: { id: Number(user.id) },
        },
        trackVersion: {
          connect: { id: Number(trackVersion.id) },
        },
      },
    });
  }

  // findAll() {
  //   return `This action returns all feedback`;
  // }

  constructor(private prisma: PrismaService) {}

  async findAll(trackVersionId: number, user: User) {
    return this.prisma.feedback.findMany({
      where: {
        trackVersionId: trackVersionId,
        userId: user.id,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto, user: User) {
    const existingFeedback = await this.prisma.feedback.findUnique({
      where: {
        id: id,
        userId: user.id,
        NOT: {
          isPublished: true,
        },
      },
    });

    if (!existingFeedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    const updatedFeedback = await this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });
    return updatedFeedback;
  }

  async remove(id: number) {
    const existingFeedback = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      throw new NotFoundException("Feedback with ID ${id} not found");
    }

    return this.prisma.feedback.delete({ where: { id } });
  }

  async publishFeedback(trackId: number, user: User) {
    return this.prisma.feedback.updateMany({
      where: {
        trackVersionId: trackId,
        userId: user.id,
      },
      data: {
        isPublished: true,
      },
    });
  }
}
