import { Feedback } from "@prisma/client";

export class GetFeedbackDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  rating: boolean;
  timestamp: number;
  trackId: number;
  comment: string;

  constructor(feedback: Feedback) {
    this.id = feedback.id;
    this.createdAt = feedback.createdAt;
    this.updatedAt = feedback.updatedAt;
    this.rating = feedback.rating;
    this.comment = feedback.comment;
    this.timestamp = feedback.timestamp;
    this.trackId = feedback.trackId;
  }
}
