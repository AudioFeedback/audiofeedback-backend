import { IsNotEmpty } from "class-validator";

export class CreateTrackVersionDto {
  @IsNotEmpty()
  description: string;
}
