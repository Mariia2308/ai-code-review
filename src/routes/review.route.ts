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

    const result = await reviewCode(
      parsed.data.code,
      parsed.data.language
    );
const risk = calculateRisk(parsed.data.code);
logMetric({
  requestId: (req as any).requestId,
  type: "review",
  issuesCount: result.issues.length,
  riskScore: risk.riskScore,
  mock: process.env.MOCK === "true"
});
    res.json({ review: result, risk });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;