import { calculateRisk } from "../services/risk.service.js";
import { reviewCode } from "../services/review.service.js";
import { calculateWeightedScore } from "../utils/severity.js";
import type { ReviewResponse } from "../schemas/review-response.schema.js";

export type ReviewStrategy = "skipped" | "mini-ai" | "full-ai";

export type DecisionResult = {
  review: ReviewResponse;
  risk: ReturnType<typeof calculateRisk>;
  strategy: ReviewStrategy;
  weightedScore: number;
};

export async function executeReviewDecision(
  code: string,
  language?: string
): Promise<DecisionResult> {

  const risk = calculateRisk(code);

  let review: ReviewResponse;
  let strategy: ReviewStrategy;

  if (risk.riskScore < 0.2) {
    strategy = "skipped";
    review = {
      summary: "Low-risk change. AI review skipped.",
      issues: [],
      improvements: []
    };
  } else if (risk.riskScore > 0.6) {
    strategy = "full-ai";
    review = await reviewCode(code, language, "full");
  } else {
    strategy = "mini-ai";
    review = await reviewCode(code, language, "mini");
  }

  const weightedScore = calculateWeightedScore(review.issues);

  return { review, risk, strategy, weightedScore };
}