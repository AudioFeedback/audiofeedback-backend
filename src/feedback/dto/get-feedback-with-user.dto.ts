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
}
