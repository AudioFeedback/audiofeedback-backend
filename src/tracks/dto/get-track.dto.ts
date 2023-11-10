import { Track } from "@prisma/client";

export class GetTrackDto {
  id: number;
  title: string;
  genre: string;
  guid: string;
  filetype: string;
  full_url: string;

  constructor(track: Track) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
  }
}
