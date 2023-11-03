import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre: string;
  @IsNotEmpty()
  authorId: number;
}