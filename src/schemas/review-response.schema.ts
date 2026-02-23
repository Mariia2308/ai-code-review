import { z } from "zod";

export const reviewResponseSchema = z.object({
  summary: z.string(),
  issues: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(["low", "medium", "high"])
    })
  ),
  improvements: z.array(z.string())
});

export type ReviewResponse = z.infer<typeof reviewResponseSchema>;