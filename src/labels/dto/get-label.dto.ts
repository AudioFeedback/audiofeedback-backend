import { Label } from "@prisma/client";

export class GetLabelDto {
  id: number;
  name: string;
  websiteUrl: string;
  description: string;
  genre: string;
  profilePicture: string;

  constructor(label: Label) {
    this.id = label.id;
    this.name = label.name;
    this.websiteUrl = label.websiteUrl;
    this.description = label.description;
    this.genre = label.genre;
    this.profilePicture = label.profilePicture;
  }
}
