import { IsArray, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre: string;
  @IsNotEmpty()
  description: string;
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  reviewerIds: number[];
}
