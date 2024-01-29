import { Role } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  sub: string;
  @IsNotEmpty()
  roles: Role[];
}
