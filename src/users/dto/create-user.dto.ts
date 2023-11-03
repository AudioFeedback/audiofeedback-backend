import { Role } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  role: Role;
}
