import { IsNotEmpty } from "class-validator";

export class UpdateTrackReviewersDto {
  @IsNotEmpty()
  reviewerIds: number[];
}
