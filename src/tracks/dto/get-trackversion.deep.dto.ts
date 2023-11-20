import { Feedback, Prisma } from "@prisma/client";
import { Request } from "express";
import { GetTrackVersionDto } from "./get-trackversion.dto";
import { FeedbackWithUser, GetFeedbackWithUserDto } from "src/feedback/dto/get-feedback-with-user.dto";

const trackVersionDeep = Prisma.validator<Prisma.TrackVersionDefaultArgs>()({
  include: {
    feedback: {
      include: {
        user: true,
      },
    },
  },
});

export type TrackVersionDeep = Prisma.TrackVersionGetPayload<
  typeof trackVersionDeep
>;

export class GetTrackVersionDeepDto extends GetTrackVersionDto {
  feedback: GetFeedbackWithUserDto[];

  constructor(trackVersion: TrackVersionDeep, req: Request) {
    super(trackVersion, req);
    this.feedback = trackVersion.feedback.map(
      (x) => new GetFeedbackWithUserDto(x),
    );
  }
}
