import { getOpenAI } from "./openai.service.js";
import { reviewResponseSchema } from "../schemas/review-response.schema.js";
import type { ReviewResponse } from "../schemas/review-response.schema.js";
import { AI_MODELS } from "../config/ai-config.js";

const MAX_CODE_LENGTH = 10000;

export async function reviewCode(
  code: string,
  language?: string,
  mode: "mini" | "full" = "mini"
): Promise<ReviewResponse> {

  const sanitizedCode = code.slice(0, MAX_CODE_LENGTH);

  // ---------------- MOCK MODE ----------------
  if (process.env.MOCK === "true") {

    const issues: ReviewResponse["issues"] = [];
    const improvements: string[] = [];

    if (sanitizedCode.includes("any")) {
      issues.push({
        title: "Unsafe type usage",
        description: "Usage of 'any' reduces type safety.",
        severity: "medium"
      });
      improvements.push("Replace 'any' with explicit types.");
    }

    const todoCount =
      (sanitizedCode.match(/TODO/g) || []).length +
      (sanitizedCode.match(/FIXME/g) || []).length;

    if (todoCount > 0) {
      issues.push({
        title: "Technical debt markers",
        description: `Detected ${todoCount} TODO/FIXME comments.`,
        severity: "low"
      });
      improvements.push("Resolve TODO/FIXME comments.");
    }

    if (
      !sanitizedCode.includes("describe") &&
      !sanitizedCode.includes("it(")
    ) {
      issues.push({
        title: "Missing unit tests",
        description: "No unit tests detected.",
        severity: "high"
      });
      improvements.push("Add unit tests for critical logic.");
    }

    return {
      summary: "Advanced deterministic mock review.",
      issues,
      improvements
    };
  }

  // ---------------- REAL AI MODE ----------------

  const model = AI_MODELS[mode];
  const openai = getOpenAI();

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: "system",
        content: "You are a strict JSON API. You MUST return only valid JSON."
      },
      {
        role: "user",
        content: `
Return JSON with this exact structure:

{
  "summary": string,
  "issues": [
    {
      "title": string,
      "description": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "improvements": string[]
}

Language: ${language ?? "unknown"}

Code:
${sanitizedCode}
`
      }
    ],
    text: {
      format: { type: "json_object" }
    }
  });

  // 🔒 Безпечне отримання message output
  const message = response.output.find(
    (item) => item.type === "message"
  );

  if (!message || !("content" in message)) {
    throw new Error("AI response did not contain a message output");
  }

  const textPart = message.content.find(
    (c) => c.type === "output_text"
  );

  if (!textPart || !("text" in textPart)) {
    throw new Error("AI message did not contain text output");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(textPart.text);
  } catch (err) {
    console.error("Failed to parse AI JSON:", textPart.text);
    throw new Error("AI response was not valid JSON");
  }

  const validated = reviewResponseSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Invalid AI JSON structure:", parsed);
    console.error(validated.error);
    throw new Error("AI response schema validation failed");
  }

  return validated.data;
}