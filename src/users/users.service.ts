import { Injectable, NotFoundException } from "@nestjs/common";
import { InviteStatus, Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { UserWithTrack } from "./dto/get-user-with-track.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    data.password = await bcrypt.hash(data.password, 10);

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
    });
  }

  async findOneDeep(userWhereInput: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where: userWhereInput,
      include: {
        labelMember: true,
      },
    });
  }

  async getNotifications(user: User) {
    const invites = await this.prisma.labelMember.findMany({
      where: {
        user: {
          id: user.id,
        },
        status: InviteStatus.INVITED,
      },
    });

    return invites.length;
  }

  async getReviewers() {
    return this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
      },
    });
  }

  async getAssignedReviewers(id: number) {
    return this.prisma.user.findMany({
      where: {
        reviewable: {
          some: {
            id: id,
          },
        },
      },
    });
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`You are not logged in`);
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateUserDto,
    });
  }

  async updatePassword(
    user: User,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`You are not logged in.`);
    }

    updateUserPasswordDto.password = await bcrypt.hash(
      updateUserPasswordDto.password,
      10,
    );

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateUserPasswordDto,
    });
  }
}
