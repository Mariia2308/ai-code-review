import { z } from "zod";

export const testgenSchema = z.object({
  code: z.string().min(1, "Code is required")
});