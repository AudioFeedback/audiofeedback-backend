import { Prisma, TrackVersion } from "@prisma/client";
import { Request } from "express";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { GetTrackVersionDto } from "./get-trackversion.dto";

const trackWithAuthor = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: { author: true },
});

export type TrackWithAuthor = Prisma.TrackGetPayload<typeof trackWithAuthor>;

export class GetTrackWithAuthorDto {
  id: number;
  title: string;
  genre: string;
  trackversions: GetTrackVersionDto[];
  author: GetUserDto;

  constructor(
    track: TrackWithAuthor,
    trackVersion: TrackVersion,
    req: Request,
  ) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = [new GetTrackVersionDto(trackVersion, req)];
    this.author = new GetUserDto(track.author);
  }
}
