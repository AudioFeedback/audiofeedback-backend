import { Prisma } from "@prisma/client";
import { Request } from "express";
import { GetFeedbackDto } from "src/feedback/dto/get-feedback.dto";
import { GetUserDto } from "src/users/dto/get-user.dto";

const trackWithAuthor = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: { author: true, feedback: true },
});

export type TrackWithAuthorAndFeedback = Prisma.TrackGetPayload<
  typeof trackWithAuthor
>;

export class GetTrackWithAuthorAndFeedbackDto {
  id: number;
  title: string;
  genre: string;
  guid: string;
  filetype: string;
  full_url: string;
  author: GetUserDto;
  feedback: GetFeedbackDto[];

  constructor(track: TrackWithAuthorAndFeedback, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.guid = track.guid;
    this.filetype = track.filetype;
    this.full_url = `${req.get("Host")}/tracks/audio/${track.guid}.${
      track.filetype
    }`;
    this.author = new GetUserDto(track.author);
    this.feedback = track.feedback;
  }
}
