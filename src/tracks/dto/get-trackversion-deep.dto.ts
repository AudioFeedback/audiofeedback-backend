import { Feedback, Prisma } from "@prisma/client";
import { Request } from "express";

const trackVersionDeep = Prisma.validator<Prisma.TrackVersionDefaultArgs>()({
  include: {
    feedback: {
      include: {
        user: true,
      },
    },
  },
});

export type TrackVersionDeep = Prisma.TrackVersionGetPayload<
  typeof trackVersionDeep
>;

export class GetTrackVersionDeepDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  timestamp: number;
  trackId: number;
  versionNumber: number;
  description: string;
  guid: string;
  filetype: string;
  fullUrl: string;
  feedback: Feedback[];

  constructor(trackVersion: TrackVersionDeep, req: Request) {
    this.id = trackVersion.id;
    this.createdAt = trackVersion.createdAt;
    this.updatedAt = trackVersion.updatedAt;
    this.versionNumber = trackVersion.versionNumber;
    this.description = trackVersion.description;
    this.guid = trackVersion.guid;
    this.filetype = trackVersion.filetype;
    this.fullUrl = `${req.get("Host")}/tracks/audio/${trackVersion.guid}.${
      trackVersion.filetype
    }`;
    this.feedback = trackVersion.feedback;
  }
}
