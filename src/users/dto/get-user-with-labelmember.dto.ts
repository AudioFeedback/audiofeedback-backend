import { ApiProperty } from "@nestjs/swagger";
import { Prisma, Role } from "@prisma/client";
import { GetLabelMemberDto } from "src/labels/dto/get-labelmember.dto";

const userWithLabelMember = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { labelMember: true },
});

export type UserWithLabelMember = Prisma.UserGetPayload<
  typeof userWithLabelMember
>;

export class GetUserWithLabelMemberDto {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      enum: [Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN],
    },
  })
  roles: Role[];
  labelMember: GetLabelMemberDto[];

  constructor(user: UserWithLabelMember) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.roles = user.roles;
    this.username = user.username;
    this.labelMember = user.labelMember.map((x) => new GetLabelMemberDto(x));
  }
}
