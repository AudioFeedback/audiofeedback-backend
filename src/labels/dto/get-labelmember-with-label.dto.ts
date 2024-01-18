import { Prisma } from "@prisma/client";
import { GetLabelDto } from "./get-label.dto";
import { InviteStatus } from "src/enums";

const getLabelMemberWithLabel =
  Prisma.validator<Prisma.LabelMemberDefaultArgs>()({
    include: { label: true },
  });

export type LabelMemberWithLabel = Prisma.LabelMemberGetPayload<
  typeof getLabelMemberWithLabel
>;

export class GetLabelMemberWithLabelDto {
  id: number;
  status: InviteStatus;
  label: GetLabelDto;

  constructor(labelMember: LabelMemberWithLabel) {
    this.id = labelMember.id;
    this.status = InviteStatus[labelMember.status];
    this.label = new GetLabelDto(labelMember.label);
  }
}
