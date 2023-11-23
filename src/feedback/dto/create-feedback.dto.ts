import { IsNotEmpty } from "class-validator";

export class CreateFeedbackDto {
  @IsNotEmpty()
  rating: boolean;
  @IsNotEmpty()
  comment: string;
  @IsNotEmpty()
  trackVersionId: number;
  @IsNotEmpty()
  timestamp: number;
}
