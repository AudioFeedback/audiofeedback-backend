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
        timestamp: createFeedbackDto.timestamp
          ? createFeedbackDto.timestamp
          : null,
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

  async isAllowedForDelete(id: number) {
    return await this.prisma.feedback.findUnique({
      where: {
        id,
        trackVersion: {
          isReviewed: false,
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.feedback.delete({ where: { id } });
  }

  async removeAsFeedbackgever(id: number) {
    return await this.prisma.feedback.findUnique({
      where: {
        id,
        isPublished: false,
      },
    });

    // if (feedback) {
    //   throw new NotFoundException("Feedback with ID ${id} already published");
    // } else if (!existingFeedback) {
    //   throw new NotFoundException("Feedback with ID ${id} not found");
    // }
  }

  async publishFeedback(trackVersionId: number, user: User) {
    const track = await this.prisma.track.findFirst({
      where: {
        trackVersions: {
          some: {
            id: trackVersionId,
          },
        },
      },
      include: {
        label: true,
      },
    });

    if (track.label === null) {
      await this.prisma.trackVersion.update({
        data: {
          isReviewed: true,
        },
        where: {
          id: trackVersionId,
        },
      });
    }

    return this.prisma.feedback.updateMany({
      where: {
        trackVersionId: trackVersionId,
        userId: user.id,
      },
      data: {
        isPublished: true,
      },
    });
  }
}
