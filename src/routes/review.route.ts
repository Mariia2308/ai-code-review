import { Router } from "express";
import { reviewSchema } from "../schemas/review.schema.js";
import { reviewCode } from "../services/review.service.js";
import { calculateRisk } from "../services/risk.service.js";
import { logMetric } from "../utils/metrics.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = reviewSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      });
    }

    // 🔵 1. Calculate risk FIRST
    const risk = calculateRisk(parsed.data.code);

    let result;
    let strategy: "skipped" | "mini-ai" | "full-ai";

    // 🔵 2. Decision Layer
    if (risk.riskScore < 0.2) {
      strategy = "skipped";

      result = {
        summary: "Low-risk change. AI review skipped.",
        issues: [],
        improvements: []
      };
    } else if (risk.riskScore > 0.6) {
      strategy = "full-ai";
      result = await reviewCode(
        parsed.data.code,
        parsed.data.language
      );
    } else {
      strategy = "mini-ai";
      result = await reviewCode(
        parsed.data.code,
        parsed.data.language
      );
    }

    // 🔵 3. Weighted severity
    const severityWeight = {
      low: 1,
      medium: 2,
      high: 3
    };

    const weightedScore = result.issues.reduce((sum, issue) => {
      return (
        sum +
        severityWeight[
          issue.severity as keyof typeof severityWeight
        ]
      );
    }, 0);

    // 🔵 4. Log with strategy
    logMetric({
      requestId: (req as any).requestId,
      type: "review",
      issuesCount: result.issues.length,
      riskScore: risk.riskScore,
      weightedIssueScore: weightedScore,
      strategy,
      mock: process.env.MOCK === "true"
    });

    res.json({ review: result, risk, strategy });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;