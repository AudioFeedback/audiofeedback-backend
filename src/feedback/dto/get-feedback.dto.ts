import { Feedback } from "@prisma/client";

export class GetFeedbackDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  rating: boolean;
  timestamp: number;
  trackVersionId: number;
  comment: string;

  constructor(feedback: Feedback) {
    this.id = feedback.id;
    this.createdAt = feedback.createdAt;
    this.updatedAt = feedback.updatedAt;
    this.isPublished = feedback.isPublished;
    this.rating = feedback.rating;
    this.comment = feedback.comment;
    this.timestamp = feedback.timestamp;
    this.trackVersionId = feedback.trackVersionId;
  }
}
