import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { GetUserWithTrackDto } from "./dto/get-user-with-track.dto";
import { GetTrackDto } from "src/tracks/dto/get-track.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { GetUserDto } from "./dto/get-user.dto";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
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

  @Get(":id")
  @Roles(Role.ADMIN)
  findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @Get("reviewers")
  async getReviewers() {
    const reviewers = await this.usersService.getReviewers();
    return reviewers.map((x) => new GetUserDto(x));
  }
}
