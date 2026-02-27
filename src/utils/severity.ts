import type { ReviewResponse } from "../schemas/review-response.schema.js";

export const severityWeight = {
  low: 1,
  medium: 2,
  high: 3
} as const;

export function calculateWeightedScore(
  issues: ReviewResponse["issues"]
) {
  return issues.reduce((sum, issue) => {
    return sum + severityWeight[issue.severity];
  }, 0);
}

export type Severity = keyof typeof severityWeight;