import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateLabelMemberStatusDto {
  @IsNotEmpty()
  @IsNumber()
  labelMemberId: number;
}
