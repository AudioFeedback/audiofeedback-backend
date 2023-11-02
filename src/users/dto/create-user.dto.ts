import { Role } from "@prisma/client";

export class CreateUserDto {
  firstname: string;
  lastname: string;
  role: Role;
}
