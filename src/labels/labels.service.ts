import { Injectable } from "@nestjs/common";
import { InviteStatus, Label, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async getInvites(user: User) {
    return this.prisma.labelMember.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      include: {
        label: true,
      },
    });
  }

  async getLabels() {
    return this.prisma.label.findMany();
  }

  async getAllTracksForLabel(labelId: number) {
    return this.prisma.track.findMany({
      where: {
        label: {
          id: labelId,
        },
      },
      include: {
        author: true,
        reviewers: {
          include: {
            feedback: {
              where: {
                isPublished: true,
                trackVersion: {
                  track: {
                    labelId: labelId,
                  },
                },
              },
            },
          },
        },
        trackVersions: {
          include: {
            feedback: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });
  }

  async getLabelById(labelId: number) {
    return this.prisma.label.findUnique({
      where: {
        id: labelId,
      },
    });
  }

  async getAvailableReviewers(labelId: number) {
    return this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
        labelMember: {
          every: {
            NOT: {
              OR: [
                {
                  labelId: labelId,
                  status: InviteStatus.ACCEPTED,
                },
                {
                  labelId: labelId,
                  status: InviteStatus.INVITED,
                },
              ],
            },
          },
        },
      },
    });
  }

  async getLabelTypeahead(query: string) {
    return this.prisma.label.findMany({
      where: {
        name: {
          startsWith: query,
          mode: "insensitive",
        },
      },
    });
  }

  async invite(user: User, label: Label) {
    return this.prisma.labelMember.create({
      data: {
        status: InviteStatus.INVITED,
        userId: user.id,
        labelId: label.id,
      },
    });
  }

  async setInviteStatus(labelMemberId: number, status: InviteStatus) {
    return this.prisma.labelMember.update({
      data: {
        status: status,
      },
      where: {
        id: labelMemberId,
      },
    });
  }
}
