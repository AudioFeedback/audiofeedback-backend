import { User } from "@prisma/client";
import { TrackStatus } from "src/tracks/dto/get-track-with-author.dto";
import { TrackWithReviewers } from "src/tracks/dto/get-track-with-reviewers.dto";

export function getStatus(
  track: TrackWithReviewers,
  user: User,
): TrackStatus[] {
  const trackStatus = [];
  const trackversion = track.trackVersions[0];

  if (user.roles.includes("ADMIN")) {
    if (trackversion.isReviewed) {
      trackStatus.push(TrackStatus.SEND);
    } else if (this.reviewers.every((x) => x.isReviewed == true)) {
      trackStatus.push(TrackStatus.READY_TO_SEND);
    } else {
      trackStatus.push(TrackStatus.READY_TO_REVIEW);
    }
  }

  if (user.roles.includes("FEEDBACKGEVER")) {
    if (trackversion.feedback.length === 0) {
      trackStatus.push(TrackStatus.READY_TO_REVIEW);
    } else {
      trackStatus.push(TrackStatus.REVIEWED);
    }
  }

  if (user.roles.includes("MUZIEKPRODUCER")) {
    if (trackversion.isReviewed) {
      trackStatus.push(TrackStatus.REVIEWED);
    } else {
      trackStatus.push(TrackStatus.PENDING_REVIEW);
    }
  }

  return trackStatus;
}
