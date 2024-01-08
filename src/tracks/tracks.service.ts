import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { createWriteStream, readFileSync, rmSync } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./dto/create-track.dto";
import { Role, User } from "@prisma/client";
import * as mm from "music-metadata";
import { UpdateTrackDto } from "./dto/update-track.dto";
// import { UpdateTrackDto } from "./dto/update-track.dto";
import { UpdateTrackReviewersDto } from "./dto/update-track-reviewers.dto";

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async saveFile(file: Express.Multer.File) {
    const rootDir = process.cwd();

    const ext = path.extname(file.originalname);
    const filetype = ext.substring(1);

    const guid = uuidv4();
    const filePath = path.join(rootDir, "audio", `${guid}${ext}`);

    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    const duration = await this.getAudioDuration(file);

    return { filetype, guid, duration };
  }

  private async getAudioDuration(
    file: Express.Multer.File,
  ): Promise<number | undefined> {
    try {
      const metadata = await mm.parseBuffer(file.buffer, file.mimetype, {
        duration: true,
      });
      return metadata.format?.duration;
    } catch (error) {
      console.error("Error reading audio file metadata:", error.message);
      return undefined;
    }
  }

  async create(createTrackDto: CreateTrackDto, user: User) {
    const reviewerIds = this.csvStringToNumberedArray(
      createTrackDto.reviewerIds,
    );

    const labelId = createTrackDto.labelId;

    if (reviewerIds.length > 0) {
      this.throwErrorIfInvalidUsers(reviewerIds);

      return this.createWithReviewers(createTrackDto, user, reviewerIds);
    }

    if (labelId) {
      return this.createWithLabel(createTrackDto, user, labelId);
    }

    return this.createWithoutReviewer(createTrackDto, user);
  }

  private async throwErrorIfInvalidUsers(reviewerIds: number[]) {
    const reviewers = await this.getReviewers();
    if (!reviewerIds.every((x) => reviewers.map((x) => x.id).includes(x))) {
      throw new NotFoundException(
        "Invalid user(s) or role specified for reviewers.",
      );
    }
  }

  private csvStringToNumberedArray(
    commaSeperatedArrayString: string | undefined,
  ) {
    if (commaSeperatedArrayString) {
      return commaSeperatedArrayString.split(",").map((x) => Number(x));
    }
    return [];
  }

  private async getReviewers() {
    return await this.prisma.user.findMany({
      where: {
        roles: {
          has: "FEEDBACKGEVER",
        },
      },
    });
  }

  private async createWithReviewers(
    createTrackDto: CreateTrackDto,
    user: User,
    reviewerIds: number[],
  ) {
    return this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        genre: createTrackDto.genre,
        author: {
          connect: { id: user.id },
        },
        reviewers: {
          connect: reviewerIds
            .map((x) => x)
            .map((id) => {
              return { id: id };
            }),
        },
      },
      include: {
        author: true,
        reviewers: true,
        label: true,
      },
    });
  }

  private async createWithoutReviewer(
    createTrackDto: CreateTrackDto,
    user: User,
  ) {
    return this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        genre: createTrackDto.genre,
        author: {
          connect: { id: Number(user.id) },
        },
      },
      include: {
        author: true,
        reviewers: true,
        label: true,
      },
    });
  }

  private async createWithLabel(
    createTrackDto: CreateTrackDto,
    user: User,
    labelId: number,
  ) {
    return this.prisma.track.create({
      data: {
        title: createTrackDto.title,
        genre: createTrackDto.genre,
        author: {
          connect: { id: Number(user.id) },
        },
        label: {
          connect: { id: Number(labelId) },
        },
      },
      include: {
        author: true,
        reviewers: true,
        label: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.roles.includes("MUZIEKPRODUCER")) {
      return this.prisma.track.findMany({
        include: {
          author: true,
          trackVersions: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              feedback: {
                where: {
                  isPublished: true,
                },
              },
            },
          },
        },
        where: {
          OR: [{ authorId: user.id }],
        },
      });
    }

    if (user.roles.includes("FEEDBACKGEVER")) {
      return this.prisma.track.findMany({
        include: {
          author: true,
          trackVersions: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              feedback: {
                where: {
                  user: {
                    id: user.id,
                  },
                },
              },
            },
          },
        },
        where: {
          reviewers: {
            some: {
              id: user.id,
            },
          },
        },
      });
    }
  }

  findOne(id: number) {
    return this.prisma.track.findUnique({
      where: { id: id },
    });
  }

  findOneTrackVersion(user: User, id: number) {
    return this.prisma.trackVersion.findUnique({
      where: {
        id: id,
        track: {
          reviewers: {
            some: {
              id: user.id,
            },
          },
        },
      },
    });
  }

  findOneDeep(id: number, user: User) {
    if (user.roles.includes(Role.MUZIEKPRODUCER)) {
      return this.prisma.track.findUnique({
        where: { id: id },
        include: {
          reviewers: true,
          trackVersions: {
            include: {
              feedback: {
                where: {
                  isPublished: true,
                  trackVersion: {
                    isReviewed: true,
                  },
                },
                orderBy: {
                  timestamp: "asc",
                },
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    } else {
      if (user.roles.includes(Role.ADMIN)) {
        return this.prisma.track.findUnique({
          where: { id: id },
          include: {
            reviewers: true,
            trackVersions: {
              include: {
                feedback: {
                  where: {
                    isPublished: true,
                  },
                  orderBy: {
                    timestamp: "asc",
                  },
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        });
      }
    }
  }

  findOneDeepReviewer(id: number, reviewer: User) {
    return this.prisma.track.findUnique({
      where: {
        id: id,
      },
      include: {
        trackVersions: {
          orderBy: {
            versionNumber: "desc",
          },
          take: 1,
          include: {
            feedback: {
              orderBy: {
                timestamp: "asc",
              },
              where: {
                user: {
                  id: reviewer.id,
                },
              },
            },
          },
        },
      },
    });
  }

  findAllVersions(id: number) {
    return this.prisma.track.findUnique({
      where: { id: id },
      include: {
        trackVersions: true,
      },
    });
  }

  async updateReviewers(
    id: number,
    updateTrackReviewersDto: UpdateTrackReviewersDto,
  ) {
    const existingTrack = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingTrack) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return await this.prisma.track.update({
      where: { id },
      data: {
        reviewers: {
          connect: updateTrackReviewersDto.reviewerIds
            .map((x) => x)
            .map((id) => {
              return { id: id };
            }),
        },
      },
    });
  }

  // async removeReviewers(
  //   id: number,
  // ) {
  //   const track = await this.prisma.track.findUnique({
  //     where: { id: id },
  //     include: {
  //       trackVersions: {
  //         include: {
  //           feedback: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!track) {
  //     throw new NotFoundException(`Track with ID ${id} not found`);
  //   }
  // }

  async updateTrack(id: number, updateTrackDto: UpdateTrackDto) {
    const existingTrack = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingTrack) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
    return updatedTrack;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }

  async getAudioFile(filename: string) {
    const rootDir = process.cwd();
    const mp3FilePath = path.join(rootDir, "audio", filename);
    return readFileSync(mp3FilePath, null);
  }

  async publishReview(trackversionId: number) {
    return this.prisma.trackVersion.update({
      where: { id: trackversionId },
      data: {
        isReviewed: true,
      },
    });
  }

  async deleteTrack(id: number) {
    const track = await this.prisma.track.findUnique({
      where: { id: id },
      include: {
        trackVersions: {
          include: {
            feedback: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const trackVersions = track.trackVersions;

    trackVersions.forEach((trackVersion) => {
      this.deleteFile(`${trackVersion.guid}.${trackVersion.filetype}`);
    });

    return this.prisma.track.delete({
      where: { id: id },
    });
  }

  async deleteFile(fileName: string) {
    try {
      const rootDir = process.cwd();
      const mp3FilePath = path.join(rootDir, "audio", fileName);
      rmSync(mp3FilePath);
    } catch (e) {
      console.error(e);
    }
  }
}
