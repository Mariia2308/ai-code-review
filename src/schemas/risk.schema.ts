import { z } from "zod";

export const riskSchema = z.object({
  code: z.string().min(1, "Code is required")
});

export type RiskInput = z.infer<typeof riskSchema>;