import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { FeedbackWithUser } from "./dto/get-feedback-with-user.dto";
// import { CreateFeedbackDto } from "./dto/create-feedback.dto";
// import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
  // create(createFeedbackDto: CreateFeedbackDto) {
  //   return "This action adds a new feedback";
  // }

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
