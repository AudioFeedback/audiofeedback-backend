import { Role, User } from "@prisma/client";

export class GetUserWithNotificationsDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  notifications: number;

  constructor(user: User, notifications: number) {
    this.id = user.id;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.roles = user.roles;
    this.notifications = notifications;
  }
}
