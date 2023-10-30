export class GetTrackDto {
  id: number;
  title: string;
  genre: string;
  guid: string;
  filetype: string;
  full_url: string;

  constructor(
    id: number,
    title: string,
    genre: string,
    guid: string,
    filetype: string,
    full_url: string,
  ) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.guid = guid;
    this.filetype = filetype;
    this.full_url = full_url;
  }
}
