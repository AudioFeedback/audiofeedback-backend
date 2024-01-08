import { TrackVersion } from "@prisma/client";
import { Request } from "express";

export class GetTrackVersionDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  trackId: number;
  versionNumber: number;
  description: string;
  guid: string;
  filetype: string;
  fullUrl: string;
  duration: number;

  constructor(trackVersion: TrackVersion, req: Request) {
    this.id = trackVersion.id;
    this.createdAt = trackVersion.createdAt;
    this.updatedAt = trackVersion.updatedAt;
    this.versionNumber = trackVersion.versionNumber;
    this.description = trackVersion.description;
    this.guid = trackVersion.guid;
    this.filetype = trackVersion.filetype;
    this.fullUrl = `${req.get("Host") ?? req.headers["X-Host-Address"]}/tracks/audio/${trackVersion.guid}.${
      trackVersion.filetype
    }`;
    this.duration = trackVersion.duration;
  }
}
