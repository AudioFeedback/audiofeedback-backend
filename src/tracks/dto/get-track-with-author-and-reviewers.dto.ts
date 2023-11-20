import { Prisma, TrackVersion } from "@prisma/client";
import { Request } from "express";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { GetTrackVersionDto } from "./get-trackversion.dto";

const trackWithAuthorAndReviewers = Prisma.validator<Prisma.TrackDefaultArgs>()(
  {
    include: { author: true, reviewers: true },
  },
);

export type TrackWithAuthorAndReviewers = Prisma.TrackGetPayload<
  typeof trackWithAuthorAndReviewers
>;

export class GetTrackWithAuthorAndReviewersDto {
  id: number;
  title: string;
  genre: string;
  trackversions: GetTrackVersionDto[];
  author: GetUserDto;
  reviewers: GetUserDto[];

  constructor(
    track: TrackWithAuthorAndReviewers,
    trackVersion: TrackVersion,
    req: Request,
  ) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = [new GetTrackVersionDto(trackVersion, req)];
    this.author = new GetUserDto(track.author);
    this.reviewers = track.reviewers.map((x) => new GetUserDto(x));
  }
}
