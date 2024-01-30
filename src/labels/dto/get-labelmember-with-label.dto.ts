import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { InviteStatus } from "src/enums";
import { GetLabelDto } from "./get-label.dto";

const getLabelMemberWithLabel =
  Prisma.validator<Prisma.LabelMemberDefaultArgs>()({
    include: { label: true },
  });

export type LabelMemberWithLabel = Prisma.LabelMemberGetPayload<
  typeof getLabelMemberWithLabel
>;

export class GetLabelMemberWithLabelDto {
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
  label: GetLabelDto;

  constructor(labelMember: LabelMemberWithLabel) {
    this.id = labelMember.id;
    this.status = InviteStatus[labelMember.status];
    this.label = new GetLabelDto(labelMember.label);
  }
}
