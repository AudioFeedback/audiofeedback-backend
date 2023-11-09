import { Role, User } from "@prisma/client";

export class GetUserDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: Role[];

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.role = user.role;
  }
}
