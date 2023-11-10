import { IsNotEmpty } from "class-validator";

export class CreateFeedbackDto {
  @IsNotEmpty()
  rating: boolean;
  @IsNotEmpty()
  comment: string;
  @IsNotEmpty()
  timestamp: number;
  @IsNotEmpty()
  trackId: number;
}
