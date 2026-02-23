import { Request, Response, NextFunction } from "express";
import { logMetric } from "../utils/metrics.js";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const entry = {
      requestId: (req as any).requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration,
      mock: process.env.MOCK === "true"
    };

    // запис у файл
    logMetric(entry);

    // лог у консоль
    console.log(
      `[${(req as any).requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}