import { ApiProperty } from "@nestjs/swagger";
import { LabelMember } from "@prisma/client";
import { InviteStatus } from "src/enums";

export class GetLabelMemberDto {
  id: number;
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      enum: [
        InviteStatus.ACCEPTED,
        InviteStatus.DECLINED,
        InviteStatus.INVITED,
      ],
    },
  })
  status: InviteStatus;

  constructor(labelMember: LabelMember) {
    this.id = labelMember.id;
    this.status = InviteStatus[labelMember.status];
  }
}
