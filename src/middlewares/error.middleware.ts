import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: err.flatten()
    });
  }

  if (err instanceof Error) {
    console.error(err);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }

  console.error("Unknown error:", err);

  res.status(500).json({
    error: "Internal Server Error"
  });
}