import { Prisma } from "@prisma/client";
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

  constructor(track: TrackWithAuthor) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.author = new GetUserDto(track.author);
  }
}
