import { Prisma } from "@prisma/client";
import { Request } from "express";
import { GetTrackVersionDto } from "./get-trackversion.dto";
import { GetFeedbackDto } from "src/feedback/dto/get-feedback.dto";

const reviewTrackVersion = Prisma.validator<Prisma.TrackVersionDefaultArgs>()({
  include: {
    feedback: true,
  },
});

export type ReviewTrackVersion = Prisma.TrackVersionGetPayload<
  typeof reviewTrackVersion
>;

export class GetReviewTrackVersionDto extends GetTrackVersionDto {
  feedback: GetFeedbackDto[];

  constructor(trackVersion: ReviewTrackVersion, req: Request) {
    super(trackVersion, req);
    this.feedback = trackVersion.feedback.map((x) => new GetFeedbackDto(x));
  }
}
