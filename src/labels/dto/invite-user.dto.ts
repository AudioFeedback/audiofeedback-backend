import { IsNotEmpty, IsNumber } from "class-validator";

export class InviteUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
