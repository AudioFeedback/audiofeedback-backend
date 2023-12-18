import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { GetUserWithTrackDto } from "./dto/get-user-with-track.dto";
import { GetTrackDto } from "src/tracks/dto/get-track.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { GetUserDto } from "./dto/get-user.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async findAll(): Promise<GetUserWithTrackDto[]> {
    const users = await this.usersService.findAll();
    return users.map((x) => {
      return {
        ...x,
        tracks: x.tracks.map((y) => {
          return new GetTrackDto(y);
        }),
      };
    });
  }

  // @Patch(":id")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @Roles(Role.ADMIN)
  // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Get("reviewers")
  @Roles(Role.MUZIEKPRODUCER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async getReviewers() {
    const reviewers = await this.usersService.getReviewers();
    return reviewers.map((x) => new GetUserDto(x));
  }
}
