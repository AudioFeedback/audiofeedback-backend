import { Prisma, Role, User } from "@prisma/client";
import { TrackStatus } from "src/enums";
import { GetLabelDto } from "src/labels/dto/get-label.dto";
import { getStatus } from "src/labels/utils/utils";
import { GetUserDto } from "src/users/dto/get-user.dto";

const trackWithAuthor = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    label: true,
    author: true,
    reviewers: {
      include: {
        feedback: true,
      },
    },
    trackVersions: {
      include: {
        feedback: true,
      },
    },
  },
});

export type TrackWithAuthor = Prisma.TrackGetPayload<typeof trackWithAuthor>;

export class GetTrackWithAuthorDto {
  id: number;
  title: string;
  genre: string;
  author: GetUserDto;
  status: TrackStatus[];
  label: GetLabelDto;

  constructor(track: TrackWithAuthor, user: User, roleOverride?: Role) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.author = new GetUserDto(track.author);
    this.status = getStatus(track, user, roleOverride);
    this.label = track.label ? new GetLabelDto(track.label) : null;
  }
}
