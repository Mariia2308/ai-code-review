export type ReviewStrategy = "skipped" | "mini-ai" | "full-ai";

export function decideStrategy(riskScore: number): ReviewStrategy {
  if (riskScore < 0.2) return "skipped";
  if (riskScore > 0.6) return "full-ai";
  return "mini-ai";
}