import fs from "fs";

export function logMetric(entry: any) {
  const logLine =
    JSON.stringify({
      timestamp: new Date().toISOString(),
      ...entry
    }) + "\n";

  fs.appendFileSync("metrics.log", logLine);
}