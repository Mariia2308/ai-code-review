import { promises as fs } from "fs";
import type { MetricEntry } from "../types/metrics.js";

const METRICS_PATH = process.env.METRICS_PATH ?? "metrics.log";

export async function logMetric(
  entry: Omit<MetricEntry, "timestamp">
): Promise<void> {
  const payload: MetricEntry = {
    timestamp: new Date().toISOString(),
    ...entry
  };

  try {
    await fs.appendFile(
      METRICS_PATH,
      JSON.stringify(payload) + "\n"
    );
  } catch (err) {
    console.error("Failed to write metric:", err);
  }
}