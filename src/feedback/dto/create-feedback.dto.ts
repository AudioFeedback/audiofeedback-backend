import { IsNotEmpty } from "class-validator";

export class CreateFeedbackDto {
  @IsNotEmpty()
  rating: boolean;
  @IsNotEmpty()
  comment: string;
  @IsNotEmpty()
  trackId: number;
  @IsNotEmpty()
  timestamp: number;
}
