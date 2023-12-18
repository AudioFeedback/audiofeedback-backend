import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre: string;
  @IsOptional()
  reviewerIds: string;
  @IsOptional()
  labelId: number;
}
