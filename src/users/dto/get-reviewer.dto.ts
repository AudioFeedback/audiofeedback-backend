import { ApiProperty } from "@nestjs/swagger";
import { Feedback, Prisma, Role, TrackVersion } from "@prisma/client";

const userWithFeedback = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    feedback: true,
  },
});

export type UserWithFeedback = Prisma.UserGetPayload<typeof userWithFeedback>;

export class GetReviewerDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      enum: [Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN],
    },
  })
  roles: Role[];
  isReviewed: boolean;

  constructor(user: UserWithFeedback, trackVersion: TrackVersion) {
    this.id = user.id;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.roles = user.roles;
    this.isReviewed = this.getReviewed(user.feedback, trackVersion);
  }

  getReviewed(feedback: Feedback[], trackVersion: TrackVersion) {
    return (
      feedback.filter(
        (x) => x.trackVersionId === trackVersion.id && x.isPublished === true,
      ).length > 0
    );
  }
}
