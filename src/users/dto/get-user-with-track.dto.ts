import { Prisma, Role } from "@prisma/client";
import { Request } from "express";
import { GetFeedbackDto } from "src/feedback/dto/get-feedback.dto";
import { GetTrackDto } from "src/tracks/dto/get-track.dto";

const userWithTrack = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { tracks: true, feedback: true },
});

export type UserWithTrack = Prisma.UserGetPayload<typeof userWithTrack>;

export class GetUserWithTrackDto {
  id: number;
  firstname: string;
  lastname: string;
  role: Role;
  tracks?: GetTrackDto[];
  feedback?: GetFeedbackDto[];

  constructor(user: UserWithTrack, req: Request) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.role = user.role;
    this.tracks = user.tracks.map((x) => {
      return new GetTrackDto(x, req);
    });
    this.feedback = user.feedback.map((x) => {
      return new GetFeedbackDto(x);
    });
  }
}
