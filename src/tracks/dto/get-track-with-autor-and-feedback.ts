import { Prisma, TrackVersion } from "@prisma/client";
import { GetFeedbackDto } from "src/feedback/dto/get-feedback.dto";
import { GetUserDto } from "src/users/dto/get-user.dto";

const trackWithAuthor = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: { author: true, trackVersions: true },
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
  trackVersions: TrackVersion[];
  feedback: GetFeedbackDto[];

  constructor(track: TrackWithAuthorAndFeedback) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.trackVersions = track.trackVersions;
    this.author = new GetUserDto(track.author);
    // this.feedback = track.feedback;
  }
}
