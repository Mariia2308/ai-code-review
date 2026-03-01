export type ReviewStrategy = "skipped" | "mini-ai" | "full-ai";

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