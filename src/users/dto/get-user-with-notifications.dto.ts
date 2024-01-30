import { ApiProperty } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";

export class GetUserWithNotificationsDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      enum: [Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN],
    },
  })
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
