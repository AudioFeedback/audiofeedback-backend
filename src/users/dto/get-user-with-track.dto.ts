import { Prisma, Role } from "@prisma/client";
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
  roles: Role[];
  tracks?: GetTrackDto[];
  feedback?: GetFeedbackDto[];

  constructor(user: UserWithTrack) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.roles = user.roles;
    this.tracks = user.tracks.map((x) => {
      return new GetTrackDto(x);
    });
    this.feedback = user.feedback.map((x) => {
      return new GetFeedbackDto(x);
    });
  }
}
