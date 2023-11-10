import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { FeedbackWithUser } from "./dto/get-feedback-with-user.dto";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Track, User } from "@prisma/client";
// import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
  async create(createFeedbackDto: CreateFeedbackDto, user: User, track: Track) {
    return await this.prisma.feedback.create({
      data: {
        rating: createFeedbackDto.rating,
        comment: createFeedbackDto.comment,
        user: {
          connect: { id: Number(user.id) },
        },
        track: {
          connect: { id: Number(track.id) },
        },
      },
    });
  }

  // findAll() {
  //   return `This action returns all feedback`;
  // }

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FeedbackWithUser[]> {
    return this.prisma.feedback.findMany({
      include: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  // update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
  //   return `This action updates a #${id} feedback`;
  // }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
