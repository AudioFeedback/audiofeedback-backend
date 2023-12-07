import { Injectable } from "@nestjs/common";
import { InviteStatus, Prisma, User } from "@prisma/client";
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
}
