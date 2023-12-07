import { InviteStatus, Prisma } from "@prisma/client";
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
  status: InviteStatus;
  label: GetLabelDto;

  constructor(labelMember: LabelMemberWithLabel) {
    this.id = labelMember.id;
    this.status = labelMember.status;
    this.label = new GetLabelDto(labelMember.label);
  }
}
