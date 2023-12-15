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
  roles: Role[];
  labelMember: GetLabelMemberDto[];

  constructor(user: UserWithLabelMember) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.roles = user.roles;
    this.labelMember = user.labelMember.map((x) => new GetLabelMemberDto(x));
  }
}
