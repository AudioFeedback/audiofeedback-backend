import { Prisma, User } from "@prisma/client";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { Request } from "express";
import { GetReviewerDto } from "../../users/dto/get-reviewer.dto";
import { GetTrackVersionDto } from "./get-trackversion.dto";

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

export enum TrackStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  READY_TO_REVIEW = "READY_TO_REVIEW",
  REVIEWED = "REVIEWED",
  REVIEW_IN_PROGRESS = "REVIEW_IN_PROGRESS",
  READY_TO_SEND = "READY_TO_SEND",
  SEND = "SEND",
}

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
      (x) => new GetReviewerDto(x, track.trackVersions[0]),
    );
    this.status = this.getStatus(track, user);
    this.trackversions = track.trackVersions.map(
      (x) => new GetTrackVersionDto(x, req),
    );
  }

  getStatus(track: TrackWithReviewers, user: User): TrackStatus[] {
    const trackStatus = [];
    const trackversion = track.trackVersions[0];

    if (user.roles.includes("ADMIN")) {
      if (trackversion.isReviewed) {
        trackStatus.push(TrackStatus.SEND);
      } else if (this.reviewers.every((x) => x.isReviewed == true)) {
        trackStatus.push(TrackStatus.READY_TO_SEND);
      } else {
        trackStatus.push(TrackStatus.READY_TO_REVIEW);
      }
    }

    if (user.roles.includes("FEEDBACKGEVER")) {
      if (trackversion.feedback.length === 0) {
        trackStatus.push(TrackStatus.READY_TO_REVIEW);
      } else {
        trackStatus.push(TrackStatus.REVIEWED);
      }
    }

    if (user.roles.includes("MUZIEKPRODUCER")) {
      if (trackversion.isReviewed) {
        trackStatus.push(TrackStatus.REVIEWED);
      } else {
        trackStatus.push(TrackStatus.PENDING_REVIEW);
      }
    }

    return trackStatus;
  }
}
