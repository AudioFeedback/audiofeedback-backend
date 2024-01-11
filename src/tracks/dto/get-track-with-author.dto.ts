import { Prisma, User } from "@prisma/client";
import { getStatus } from "src/labels/utils/utils";
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
    this.status = getStatus(track, user);
  }
}
