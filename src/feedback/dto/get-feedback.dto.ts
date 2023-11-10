import { Feedback } from "@prisma/client";

export class GetFeedbackDto {
  id: number;
  rating: boolean;
  timestamp: Date;
  trackId: number;
  comment: string;

  constructor(feedback: Feedback) {
    this.id = feedback.id;
    this.rating = feedback.rating;
    this.comment = feedback.comment;
    this.timestamp = feedback.timestamp;
    this.trackId = feedback.trackId;
  }
}
