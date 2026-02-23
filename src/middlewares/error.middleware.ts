import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Global error:", err);

  res.status(500).json({
    error: "Something went wrong",
    message:
      process.env.NODE_ENV === "development" ? err.message : undefined
  });
}