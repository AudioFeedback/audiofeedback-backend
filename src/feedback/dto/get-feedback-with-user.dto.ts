import { Prisma } from "@prisma/client";
import { GetUserDto } from "src/users/dto/get-user.dto";

const feedbackWithUser = Prisma.validator<Prisma.FeedbackDefaultArgs>()({
  include: { user: true },
});

export type FeedbackWithUser = Prisma.FeedbackGetPayload<
  typeof feedbackWithUser
>;

export class GetFeedbackWithUserDto {
  id: number;
  rating: boolean;
  comment: string;
  timestamp: number;
  user: GetUserDto;

  constructor(feedback: FeedbackWithUser) {
    this.id = feedback.id;
    this.rating = feedback.rating;
    this.comment = feedback.comment;
    this.timestamp = feedback.timestamp;
    this.user = feedback.user;
  }
}
