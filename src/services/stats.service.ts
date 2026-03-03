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

type Session = {
  issuesCount: number;
  riskScore: number;
  duration: number;
  weightedIssueScore: number;
  strategy?: string;
};

async function readMetrics(): Promise<MetricEntry[]> {
  try {
    const data = await fs.readFile("metrics.log", "utf-8");

    return data
      .split("\n")
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as MetricEntry[];
  } catch {
    return [];
  }
}

function groupSessions(entries: MetricEntry[]): Session[] {
  const grouped: Record<string, Partial<MetricEntry>> = {};

  for (const entry of entries) {
    if (!entry.requestId) continue;

    if (!grouped[entry.requestId]) {
      grouped[entry.requestId] = {};
    }

    if (entry.type === "review") {
      grouped[entry.requestId].issuesCount = entry.issuesCount;
      grouped[entry.requestId].riskScore = entry.riskScore;
      grouped[entry.requestId].weightedIssueScore =
        entry.weightedIssueScore;
      grouped[entry.requestId].strategy = entry.strategy;
    }

    if (entry.method) {
      grouped[entry.requestId].duration = entry.duration;
    }
  }

  return Object.values(grouped)
    .filter(
      s =>
        s.issuesCount !== undefined &&
        s.riskScore !== undefined &&
        s.duration !== undefined
    )
    .map(s => ({
      issuesCount: s.issuesCount!,
      riskScore: s.riskScore!,
      duration: s.duration!,
      weightedIssueScore: s.weightedIssueScore ?? 0,
      strategy: s.strategy
    }));
}

function average(numbers: number[]): number {
  if (!numbers.length) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function averageDuration(sessions: Session[]): number {
  return average(sessions.map(s => s.duration));
}

function buildAggregates(sessions: Session[]) {
  const totalReviews = sessions.length;

  if (totalReviews === 0) {
    return { totalReviews: 0 };
  }

  const risks = sessions.map(s => s.riskScore);
  const issues = sessions.map(s => s.issuesCount);
  const weighted = sessions.map(s => s.weightedIssueScore);

  const highRisk = sessions.filter(s => s.riskScore > 0.6);
  const mediumRisk = sessions.filter(
    s => s.riskScore > 0.3 && s.riskScore <= 0.6
  );
  const lowRisk = sessions.filter(s => s.riskScore <= 0.3);

  const byStrategy = (name: string) =>
    sessions.filter(s => s.strategy === name);

  const skipped = byStrategy("skipped");
  const mini = byStrategy("mini-ai");
  const full = byStrategy("full-ai");

  return {
    totalReviews,

    averageRisk: Number(average(risks).toFixed(3)),
    averageIssues: Number(average(issues).toFixed(3)),
    averageWeightedIssues: Number(average(weighted).toFixed(3)),
    averageDuration: Number(
      averageDuration(sessions).toFixed(1)
    ),

    maxRisk: Math.max(...risks),
    maxIssues: Math.max(...issues),

    buckets: {
      highRiskCount: highRisk.length,
      mediumRiskCount: mediumRisk.length,
      lowRiskCount: lowRisk.length
    },

    correlationRiskIssues: Number(
      pearson(risks, issues).toFixed(3)
    ),
    correlationRiskWeighted: Number(
      pearson(risks, weighted).toFixed(3)
    ),

    strategyBreakdown: {
      skipped: skipped.length,
      miniAI: mini.length,
      fullAI: full.length
    },

    averageDurationByStrategy: {
      skipped: Number(
        averageDuration(skipped).toFixed(1)
      ),
      miniAI: Number(
        averageDuration(mini).toFixed(1)
      ),
      fullAI: Number(
        averageDuration(full).toFixed(1)
      )
    }
  };
}

export async function getStats() {
  const entries = await readMetrics();
  const sessions = groupSessions(entries);
  return buildAggregates(sessions);
}