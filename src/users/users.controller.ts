import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { GetTrackDto } from "src/tracks/dto/get-track.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserWithTrackDto } from "./dto/get-user-with-track.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { UpdateUserRolesDto } from "./dto/update-user-roles.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

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

  @Patch("roles")
  @Roles(Role.ADMIN, Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async updateUserRoles(
    @Body() updateUserRoles: UpdateUserRolesDto,
    @Req() req: Request,
  ) {
    return await this.usersService.updateRoles(<User>req.user, updateUserRoles);
  }

  @Get("reviewers")
  @Roles(Role.MUZIEKPRODUCER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async getReviewers() {
    const reviewers = await this.usersService.getReviewers();
    return reviewers.map((x) => new GetUserDto(x));
  }

  @Get("/name-exists/:username")
  async getNameExists(@Param("username") username: string) {
    return await this.usersService.getNameExists(username);
  }
}
