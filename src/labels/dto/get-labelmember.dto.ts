import { InviteStatus, LabelMember } from "@prisma/client";

export class GetLabelMemberDto {
  id: number;
  status: InviteStatus;

  constructor(labelMember: LabelMember) {
    this.id = labelMember.id;
    this.status = labelMember.status;
  }
}
