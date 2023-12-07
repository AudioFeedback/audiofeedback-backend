import { Prisma, User } from "@prisma/client";
import { GetUserDto } from "src/users/dto/get-user.dto";

const trackWithAuthor = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    author: true,
    trackVersions: {
      include: {
        feedback: true,
      },
    },
  },
});

export type TrackWithAuthor = Prisma.TrackGetPayload<typeof trackWithAuthor>;

export enum TrackStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  READY_TO_REVIEW = "READY_TO_REVIEW",
  REVIEWED = "REVIEWED",
  REVIEW_IN_PROGRESS = "REVIEW_IN_PROGRESS",
  READY_TO_SEND = "READY_TO_SEND",
  SEND = "SEND",
}

export class GetTrackWithAuthorDto {
  id: number;
  title: string;
  genre: string;
  author: GetUserDto;
  status: TrackStatus[];

  constructor(track: TrackWithAuthor, user: User) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.author = new GetUserDto(track.author);
    this.status = this.getStatus(track, user);
  }

  getStatus(track: TrackWithAuthor, user: User): TrackStatus[] {
    const trackStatus = [];
    const trackversion = track.trackVersions[0];

    if (user.roles.includes("ADMIN")) {
      if (trackversion.feedback.length === 0) {
        trackStatus.push(TrackStatus.READY_TO_REVIEW);
      } else if (!trackversion.isReviewed) {
        trackStatus.push(TrackStatus.READY_TO_SEND);
      } else {
        trackStatus.push(TrackStatus.SEND);
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
