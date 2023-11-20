import { Prisma } from "@prisma/client";
import { Request } from "express";
import { GetTrackVersionDeepDto } from "./get-trackversion.deep.dto";
import { GetUserDto } from "src/users/dto/get-user.dto";

const trackDeep = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    reviewers: true,
    trackVersions: {
      include: {
        feedback: {
          include: {
            user: true,
          },
        },
      },
    },
  },
});

export type TrackDeep = Prisma.TrackGetPayload<typeof trackDeep>;

export class GetTrackDeepDto {
  id: number;
  title: string;
  genre: string;
  trackversions: GetTrackVersionDeepDto[];
  reviewers: GetUserDto[];

  constructor(track: TrackDeep, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = track.trackVersions.map(
      (x) => new GetTrackVersionDeepDto(x, req),
    );
    this.reviewers = track.reviewers.map((x) => new GetUserDto(x));
  }
}
