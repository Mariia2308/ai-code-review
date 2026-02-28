import { Router } from "express";
import { reviewSchema } from "../schemas/review.schema.js";
import { logMetric } from "../utils/metrics.js";
import { executeReviewDecision } from "../engine/review-decision.engine.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const parsed = reviewSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      });
    }

    const { code, language } = parsed.data;

    const { review, risk, strategy, weightedScore } =
      await executeReviewDecision(code, language);

    logMetric({
      requestId: req.requestId,
      type: "review",
      issuesCount: review.issues.length,
      riskScore: risk.riskScore,
      weightedIssueScore: weightedScore,
      strategy,
      mock: process.env.MOCK === "true"
    });

    res.json({
      review,
      risk,
      strategy,
      weightedScore,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

export default router;