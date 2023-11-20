import { Track } from "@prisma/client";

export class GetTrackDto {
  id: number;
  title: string;
  genre: string;

  constructor(track: Track) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
  }
}
