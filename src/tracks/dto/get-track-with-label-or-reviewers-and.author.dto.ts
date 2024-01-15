import { Prisma, TrackVersion } from "@prisma/client";
import { Request } from "express";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { GetLabelDto } from "../../labels/dto/get-label.dto";
import { GetTrackVersionDto } from "./get-trackversion.dto";

const trackWithLabelOrAuthorAndReviewers =
  Prisma.validator<Prisma.TrackDefaultArgs>()({
    include: { author: true, reviewers: true, label: true },
  });

export type TrackWithLabelOrAuthorAndReviewers = Prisma.TrackGetPayload<
  typeof trackWithLabelOrAuthorAndReviewers
>;

export class GetTrackWithLabelOrReviewersAndAuthor {
  id: number;
  title: string;
  genre: string;
  trackversions: GetTrackVersionDto[];
  author: GetUserDto;
  reviewers: GetUserDto[];
  label: GetLabelDto;

  constructor(
    track: TrackWithLabelOrAuthorAndReviewers,
    trackVersion: TrackVersion,
    req: Request,
  ) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackversions = [new GetTrackVersionDto(trackVersion, req)];
    this.author = new GetUserDto(track.author);
    this.reviewers = track.reviewers.map((x) => new GetUserDto(x));
    this.label = track.label;
  }
}
