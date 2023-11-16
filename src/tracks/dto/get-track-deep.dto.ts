import { Prisma } from "@prisma/client";
import { Request } from "express";
import { GetTrackVersionDto } from "./get-trackversion.dto";
import { GetTrackVersionDeepDto } from "./get-trackversion-deep.dto";

const trackDeep = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
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
  trackversions: GetTrackVersionDto[];

  constructor(track: TrackDeep, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = track.trackVersions.map(
      (x) => new GetTrackVersionDeepDto(x, req),
    );
  }
}
