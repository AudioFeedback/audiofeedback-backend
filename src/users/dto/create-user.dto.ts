import { Role } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  role: Role;
}
