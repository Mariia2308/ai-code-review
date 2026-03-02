import type { ReviewStrategy } from "../engine/strategy.js";
export type MetricEntry = {
  timestamp: string;
  requestId: string;
  type?: "review";
  issuesCount?: number;
  riskScore?: number;
  method?: string;
  duration?: number;
  mock?: boolean;
  weightedIssueScore?: number;
  strategy?: ReviewStrategy;
};