import { z } from "zod";

export const reviewSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().optional()
});

export type ReviewInput = z.infer<typeof reviewSchema>;