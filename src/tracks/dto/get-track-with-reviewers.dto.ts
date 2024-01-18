import { Prisma, User } from "@prisma/client";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { Request } from "express";
import { GetReviewerDto } from "../../users/dto/get-reviewer.dto";
import { GetTrackVersionDto } from "./get-trackversion.dto";
import { getStatus } from "src/labels/utils/utils";
import { TrackStatus } from "src/enums";

const trackWithReviewers = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    author: true,
    reviewers: {
      include: {
        feedback: true,
      },
    },
    trackVersions: {
      include: {
        feedback: {
          where: {
            isPublished: true,
          },
        },
      },
    },
  },
});

export type TrackWithReviewers = Prisma.TrackGetPayload<
  typeof trackWithReviewers
>;

export class GetTrackWithReviewersDto {
  id: number;
  title: string;
  genre: string;
  author: GetUserDto;
  reviewers: GetReviewerDto[];
  status: TrackStatus[];
  trackversions: GetTrackVersionDto[];

  constructor(track: TrackWithReviewers, user: User, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.author = new GetUserDto(track.author);
    this.reviewers = track.reviewers.map(
      (x) =>
        new GetReviewerDto(
          x,
          track.trackVersions[track.trackVersions.length - 1],
        ),
    );
    this.status = getStatus(track, user);
    this.trackversions = track.trackVersions.map(
      (x) => new GetTrackVersionDto(x, req),
    );
  }
}
