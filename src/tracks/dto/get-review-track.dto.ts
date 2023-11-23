import { Prisma } from "@prisma/client";
import { Request } from "express";
import { GetReviewTrackVersionDto } from "./get-review-trackversion.dto";

const reviewTrack = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    trackVersions: {
      include: {
        feedback: true,
      },
    },
  },
});

export type ReviewTrack = Prisma.TrackGetPayload<typeof reviewTrack>;

export class GetReviewTrackDto {
  id: number;
  title: string;
  genre: string;
  trackversions: GetReviewTrackVersionDto[];

  constructor(track: ReviewTrack, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = track.trackVersions.map(
      (x) => new GetReviewTrackVersionDto(x, req),
    );
  }
}
