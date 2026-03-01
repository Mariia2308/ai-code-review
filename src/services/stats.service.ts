import { pearson } from "../utils/math.js";
import { promises as fs } from "fs";

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
  strategy?: string;
};

export async function getStats() {
  let data: string;

  try {
    data = await fs.readFile("metrics.log", "utf-8");
  } catch {
    return { totalReviews: 0 };
  }

  const lines = data.split("\n").filter(Boolean);

  const entries: MetricEntry[] = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(Boolean) as MetricEntry[];

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
      grouped[entry.requestId].strategy = entry.strategy;
    }

    if (entry.method) {
      grouped[entry.requestId].duration = entry.duration;
    }
  }

  const sessions = Object.values(grouped).filter(
    s => s.issuesCount !== undefined &&
         s.duration !== undefined &&
         s.riskScore !== undefined
  );

  const totalReviews = sessions.length;

  if (totalReviews === 0) {
    return { totalReviews: 0 };
  }



  const byStrategy = (name: string) =>
    sessions.filter(s => s.strategy === name);

  const skipped = byStrategy("skipped");
  const mini = byStrategy("mini-ai");
  const full = byStrategy("full-ai");

  const avgDuration = (arr: typeof sessions) =>
    arr.length
      ? arr.reduce((sum, s) => sum + (s.duration ?? 0), 0) / arr.length
      : 0;


  const risks = sessions.map(s => s.riskScore!);
  const issues = sessions.map(s => s.issuesCount!);
  const weighted = sessions.map(s => s.weightedIssueScore ?? 0);

  const averageRisk =
    risks.reduce((a, b) => a + b, 0) / totalReviews;

  const averageIssues =
    issues.reduce((a, b) => a + b, 0) / totalReviews;

  const averageWeighted =
    weighted.reduce((a, b) => a + b, 0) / totalReviews;

  const averageDurationAll =
    sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0) /
    totalReviews;

  const highRisk = sessions.filter(s => s.riskScore! > 0.6);
  const mediumRisk = sessions.filter(
    s => s.riskScore! > 0.3 && s.riskScore! <= 0.6
  );
  const lowRisk = sessions.filter(s => s.riskScore! <= 0.3);

  const correlation = pearson(risks, issues);
  const correlationWeighted = pearson(risks, weighted);

  return {
    totalReviews,

    averageRisk: Number(averageRisk.toFixed(3)),
    averageIssues: Number(averageIssues.toFixed(3)),
    averageWeightedIssues: Number(averageWeighted.toFixed(3)),
    averageDuration: Number(averageDurationAll.toFixed(1)),

    maxRisk: Math.max(...risks),
    maxIssues: Math.max(...issues),

    buckets: {
      highRiskCount: highRisk.length,
      mediumRiskCount: mediumRisk.length,
      lowRiskCount: lowRisk.length
    },

    correlationRiskIssues: Number(correlation.toFixed(3)),
    correlationRiskWeighted: Number(correlationWeighted.toFixed(3)),

    strategyBreakdown: {
      skipped: skipped.length,
      miniAI: mini.length,
      fullAI: full.length
    },

    averageDurationByStrategy: {
      skipped: Number(avgDuration(skipped).toFixed(1)),
      miniAI: Number(avgDuration(mini).toFixed(1)),
      fullAI: Number(avgDuration(full).toFixed(1))
    }
  };
}