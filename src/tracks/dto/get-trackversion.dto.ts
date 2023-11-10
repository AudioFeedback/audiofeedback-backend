import { TrackVersion } from "@prisma/client";
import { Request } from "express";

export class GetTrackVersionDto {
  id: number;
  timestamp: Date;
  trackId: number;
  versionNumber: number;
  description: string;
  guid: string;
  filetype: string;
  fullUrl: string;

  constructor(trackVersion: TrackVersion, req: Request) {
    this.id = trackVersion.id;
    this.timestamp = trackVersion.timestamp;
    this.versionNumber = trackVersion.versionNumber;
    this.description = trackVersion.description;
    this.guid = trackVersion.guid;
    this.filetype = trackVersion.filetype;
    this.fullUrl = `${req.get("Host")}/tracks/audio/${trackVersion.guid}.${
      trackVersion.filetype
    }`;
  }
}
