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

    logMetric({
      requestId: req.requestId,
      method: req.method,
      duration
    }).catch(console.error);
  });

  next();
}