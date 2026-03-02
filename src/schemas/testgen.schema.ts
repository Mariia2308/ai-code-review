import { z } from "zod";

export const testgenSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().optional()
});

export type TestGenInput = z.infer<typeof testgenSchema>;