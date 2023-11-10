import { Prisma, Track, TrackVersion } from "@prisma/client";
import { Request } from "express";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { GetTrackVersionDto } from "./get-trackversion.dto";

const trackWithTrackVersions = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: { trackVersions: true },
});

export type TrackWithTrackVersions = Prisma.TrackGetPayload<
  typeof trackWithTrackVersions
>;

export class GetTrackWithTrackVersionsDto {
  id: number;
  title: string;
  genre: string;
  trackversions: GetTrackVersionDto[];
  author: GetUserDto;

  constructor(track: TrackWithTrackVersions, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = track.trackVersions.map(
      (x) => new GetTrackVersionDto(x, req),
    );
  }
}
