import { Injectable } from "@nestjs/common";
import { InviteStatus, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async getInvites(user: User) {
    return await this.prisma.labelMember.findMany({
      where: {
        user: {
          id: user.id,
        },
        status: InviteStatus.INVITED,
      },
      include: {
        label: true,
      },
    });
  }

  async getAvailableReviewers() {
    return this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
        NOT: {
          LabelMember: {
            some: {
              OR: [
                {
                  status: "ACCEPTED",
                },
                {
                  status: "INVITED",
                },
              ],
            },
          },
        },
      },
    });
  }
}
