import { IsNotEmpty } from "class-validator";

export class UpdateFeedbackDto {
  @IsNotEmpty()
  rating: boolean;
  @IsNotEmpty()
  comment: string;
  @IsNotEmpty()
  timestamp: number;
}
