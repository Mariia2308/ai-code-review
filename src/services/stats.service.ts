import fs from "fs";

type MetricEntry = {
  timestamp: string;
  requestId: string;
  type?: string;
  issuesCount?: number;
  riskScore?: number;
  method?: string;
  duration?: number;
  mock?: boolean;
  weightedIssueScore?: number;
};

export function getStats() {
  if (!fs.existsSync("metrics.log")) {
    return { totalReviews: 0 };
  }

  const lines = fs.readFileSync("metrics.log", "utf-8")
    .split("\n")
    .filter(Boolean);

  const entries: MetricEntry[] = lines.map(line => JSON.parse(line));

  const grouped: Record<string, Partial<MetricEntry>> = {};

  for (const entry of entries) {
    if (!entry.requestId) continue;

    if (!grouped[entry.requestId]) {
      grouped[entry.requestId] = {};
    }

    if (entry.type === "review") {
      grouped[entry.requestId].issuesCount = entry.issuesCount;
      grouped[entry.requestId].riskScore = entry.riskScore;
      grouped[entry.requestId].weightedIssueScore = entry.weightedIssueScore;
    }

    if (entry.method) {
      grouped[entry.requestId].duration = entry.duration;
    }
  }

  

  const sessions = Object.values(grouped).filter(
    s => s.issuesCount !== undefined && s.duration !== undefined
  );


  const totalReviews = sessions.length;

  if (totalReviews === 0) {
    return { totalReviews: 0 };
  }

  const averageRisk =
    sessions.reduce((sum, s) => sum + (s.riskScore ?? 0), 0) /
    totalReviews;

  const averageIssues =
    sessions.reduce((sum, s) => sum + (s.issuesCount ?? 0), 0) /
    totalReviews;

    const averageWeighted =
  sessions.reduce((sum, s) => sum + (s.weightedIssueScore ?? 0), 0) /
  totalReviews;

  const averageDuration =
    sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0) /
    totalReviews;

  const maxRisk = Math.max(...sessions.map(s => s.riskScore ?? 0));
  const maxIssues = Math.max(...sessions.map(s => s.issuesCount ?? 0));

  const highRisk = sessions.filter(s => (s.riskScore ?? 0) > 0.6);
  const mediumRisk = sessions.filter(
    s => (s.riskScore ?? 0) > 0.3 && (s.riskScore ?? 0) <= 0.6
  );
  const lowRisk = sessions.filter(s => (s.riskScore ?? 0) <= 0.3);

  const avgIssuesHigh =
    highRisk.length > 0
      ? highRisk.reduce((sum, s) => sum + (s.issuesCount ?? 0), 0) /
        highRisk.length
      : 0;

  const avgIssuesLow =
    lowRisk.length > 0
      ? lowRisk.reduce((sum, s) => sum + (s.issuesCount ?? 0), 0) /
        lowRisk.length
      : 0;

    // 🔵 Pearson Correlation (risk vs issues)

  const risks = sessions.map(s => s.riskScore ?? 0);
  const issues = sessions.map(s => s.issuesCount ?? 0);

  const meanRisk = averageRisk;
  const meanIssues = averageIssues;

  let numerator = 0;
  let riskVariance = 0;
  let issuesVariance = 0;

  for (let i = 0; i < sessions.length; i++) {
    const riskDiff = risks[i] - meanRisk;
    const issuesDiff = issues[i] - meanIssues;

    numerator += riskDiff * issuesDiff;
    riskVariance += riskDiff * riskDiff;
    issuesVariance += issuesDiff * issuesDiff;
  }

  const denominator = Math.sqrt(riskVariance * issuesVariance);

  const correlation =
    denominator === 0 ? 0 : numerator / denominator;



    const weighted = sessions.map(s => s.weightedIssueScore ?? 0);

let num2 = 0;
let weightedVar = 0;

for (let i = 0; i < sessions.length; i++) {
  const riskDiff = risks[i] - meanRisk;
  const weightedDiff = weighted[i] - averageWeighted;

  num2 += riskDiff * weightedDiff;
  weightedVar += weightedDiff * weightedDiff;
}

const denom2 = Math.sqrt(riskVariance * weightedVar);

const correlationWeighted =
  denom2 === 0 ? 0 : num2 / denom2;
  return {
    totalReviews,
    averageRisk: Number(averageRisk.toFixed(3)),
    averageIssues: Number(averageIssues.toFixed(3)),
    averageDuration: Number(averageDuration.toFixed(1)),
    maxRisk,
    maxIssues,
    buckets: {
      highRiskCount: highRisk.length,
      mediumRiskCount: mediumRisk.length,
      lowRiskCount: lowRisk.length
    },
    averageIssuesHighRisk: Number(avgIssuesHigh.toFixed(3)),
    averageIssuesLowRisk: Number(avgIssuesLow.toFixed(3)),
    correlationRiskIssues: Number(correlation.toFixed(3)),
    averageWeightedIssues: Number(averageWeighted.toFixed(3)),
correlationRiskWeighted: Number(correlationWeighted.toFixed(3)),
  };
}