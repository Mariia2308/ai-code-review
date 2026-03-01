import { RISK_THRESHOLDS } from "../config/risk-config.js";

export type ReviewStrategy = "skipped" | "mini-ai" | "full-ai";

export function decideStrategy(riskScore: number): ReviewStrategy {
  if (riskScore < RISK_THRESHOLDS.skip) return "skipped";
  if (riskScore > RISK_THRESHOLDS.full) return "full-ai";
  return "mini-ai";
}