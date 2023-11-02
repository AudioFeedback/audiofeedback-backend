import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { GetUserWithTrackDto } from "./dto/get-user-with-track.dto";
import { GetTrackDto } from "src/tracks/dto/get-track.dto";
import { Request } from "express";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Req() req: Request): Promise<GetUserWithTrackDto[]> {
    const users = await this.usersService.findAll();
    return users.map((x) => {
      return {
        ...x,
        tracks: x.tracks.map((y) => {
          return new GetTrackDto(y, req);
        }),
      };
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
