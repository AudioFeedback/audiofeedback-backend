import { Prisma } from "@prisma/client";
import { GetUserWithTrackDto } from "src/users/dto/get-user-with-track.dto";
import { Request } from "express";

const trackWithAuthor = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: { author: true },
});

export type TrackWithAuthor = Prisma.TrackGetPayload<typeof trackWithAuthor>;

export class GetTrackWithAuthorDto {
  id: number;
  title: string;
  genre: string;
  guid: string;
  filetype: string;
  full_url: string;
  author: GetUserWithTrackDto;

  constructor(track: TrackWithAuthor, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.guid = track.guid;
    this.filetype = track.filetype;
    this.full_url = `${req.get("Host")}/tracks/audio/${track.guid}.${
      track.filetype
    }`;
    this.author = track.author;
  }
}
