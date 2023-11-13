import { IsNotEmpty } from "class-validator";

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre: string;
  @IsNotEmpty()
  description: string;
}
