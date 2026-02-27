import { Router } from "express";
import { reviewSchema } from "../schemas/review.schema.js";
import { reviewCode } from "../services/review.service.js";
import { calculateRisk } from "../services/risk.service.js";
import { logMetric } from "../utils/metrics.js";
import { calculateWeightedScore } from "../utils/severity.js";
import { decideStrategy } from "../utils/strategy.js";
import { skippedReview } from "../utils/review-templates.js";

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

    // 1️⃣ Calculate structural risk
    const risk = calculateRisk(code);

    // 2️⃣ Decide routing strategy
    const strategy = decideStrategy(risk.riskScore);

    // 3️⃣ Execute review based on strategy
    let review;

    if (strategy === "skipped") {
      review = skippedReview();
    } else if (strategy === "full-ai") {
      review = await reviewCode(code, language, "full");
    } else {
      review = await reviewCode(code, language, "mini");
    }


    const weightedScore = calculateWeightedScore(review.issues);

    logMetric({
      requestId: (req as any).requestId,
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
      strategy
    });

  } catch (error) {
    next(error); 
  }
});

export default router;