import type { ReviewResponse } from "../schemas/review-response.schema.js";

export function skippedReview(): ReviewResponse {
  return {
    summary: "Low-risk change. AI review skipped.",
    issues: [],
    improvements: []
  };
}