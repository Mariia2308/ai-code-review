import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = crypto.randomUUID();

  (req as any).requestId = id;

  next();
}