import { calculateRisk } from "../services/risk.service.js";
import { reviewCode } from "../services/review.service.js";
import { calculateWeightedScore } from "../utils/severity.js";
import type { ReviewResponse } from "../schemas/review-response.schema.js";
import { decideStrategy } from "./strategy.js";
import { skippedReview } from "./review-templates.js";
import type { ReviewStrategy } from "./strategy.js";

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

  const baseStrategy = decideStrategy(risk.riskScore);

  if (baseStrategy === "skipped") {
    strategy = "skipped";
    review = skippedReview();

  } else if (baseStrategy === "full-ai") {
    strategy = "full-ai";
    review = await reviewCode(code, language, "full");

  } else {
    const random = Math.random();

    if (random < 0.5) {
      strategy = "mini-ai";
      review = await reviewCode(code, language, "mini");
    } else {
      strategy = "full-ai";
      review = await reviewCode(code, language, "full");
    }
  }

  const weightedScore = calculateWeightedScore(review.issues);

  return { review, risk, strategy, weightedScore };
}