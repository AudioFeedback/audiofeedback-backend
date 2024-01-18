import { User } from "@prisma/client";
import { TrackStatus } from "src/enums";
import { TrackWithReviewers } from "src/tracks/dto/get-track-with-reviewers.dto";

export function getStatus(
  track: TrackWithReviewers,
  user: User,
): TrackStatus[] {
  const trackStatus = [];
  const trackversion = track.trackVersions[track.trackVersions.length - 1];

  if (user.roles.includes("ADMIN")) {
    if (trackversion.isReviewed) {
      trackStatus.push(TrackStatus.SEND);
    } else if (
      track.reviewers
        .map((x) => x.id)
        .every((x) =>
          trackversion.feedback
            .filter((x) => x.isPublished)
            .map((y) => y.userId)
            .includes(x),
        )
    ) {
      trackStatus.push(TrackStatus.READY_TO_SEND);
    } else if (
      track.reviewers
        .map((x) => x.id)
        .some((x) =>
          trackversion.feedback
            .filter((x) => x.isPublished)
            .map((y) => y.userId)
            .includes(x),
        )
    ) {
      trackStatus.push(TrackStatus.REVIEW_IN_PROGRESS);
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
