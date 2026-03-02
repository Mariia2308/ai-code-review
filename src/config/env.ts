import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  port: Number(process.env.PORT ?? 5000),
  mock: process.env.MOCK === "true",
  metricsPath: process.env.METRICS_PATH ?? "metrics.log"
};