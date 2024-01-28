import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { GetUserWithTrackDto } from "./dto/get-user-with-track.dto";
import { GetTrackDto } from "src/tracks/dto/get-track.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { GetUserDto } from "./dto/get-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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

  @Patch()
  @Roles(Role.ADMIN, Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto, <User>req.user);
  }

  @Patch("Password")
  @Roles(Role.ADMIN, Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async updatePassword(
    @Body() updateUserPassword: UpdateUserPasswordDto,
    @Req() req: Request,
  ) {
    return await this.usersService.updatePassword(
      <User>req.user,
      updateUserPassword,
    );
  }

  @Get("reviewers")
  @Roles(Role.MUZIEKPRODUCER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async getReviewers() {
    const reviewers = await this.usersService.getReviewers();
    return reviewers.map((x) => new GetUserDto(x));
  }
}
