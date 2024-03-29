import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      enum: [Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN],
    },
  })
  roles: Role[];
}
