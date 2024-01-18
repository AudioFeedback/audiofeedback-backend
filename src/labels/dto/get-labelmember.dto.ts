import { LabelMember } from "@prisma/client";
import { InviteStatus } from "src/enums";

export class GetLabelMemberDto {
  id: number;
  status: InviteStatus;

  constructor(labelMember: LabelMember) {
    this.id = labelMember.id;
    this.status = InviteStatus[labelMember.status];
  }
}
