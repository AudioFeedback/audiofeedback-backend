import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { UserWithTrack } from "./dto/get-user-with-track.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<UserWithTrack[]> {
    return this.prisma.user.findMany({
      include: {
        tracks: true,
        feedback: true,
      },
    });
  }

  async findOne(userWhereInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereInput,
      include: {
        tracks: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
