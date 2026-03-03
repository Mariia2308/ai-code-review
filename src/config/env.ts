import dotenv from "dotenv";
dotenv.config();

export function getConfig() {
  return {
    port: Number(process.env.PORT ?? 5000),
    mock: process.env.MOCK === "true",
    metricsPath: process.env.METRICS_PATH ?? "metrics.log"
  };
}