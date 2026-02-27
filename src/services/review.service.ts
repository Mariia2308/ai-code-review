import { openai } from "./openai.service.js";
import { reviewResponseSchema } from "../schemas/review-response.schema.js";
import type { ReviewResponse } from "../schemas/review-response.schema.js";

export async function reviewCode(
  code: string,
  language?: string,
  mode: "mini" | "full" = "mini"
): Promise<ReviewResponse> {

if (process.env.MOCK === "true") {

const issues: ReviewResponse["issues"] = [];
const improvements: string[] = [];

  const lines = code.split("\n").length;


  if (code.includes("any")) {
    issues.push({
      title: "Unsafe type usage",
      description: "Usage of 'any' reduces type safety.",
      severity: "medium"
    });
    improvements.push("Replace 'any' with explicit types.");
  }


  const todoCount =
    (code.match(/TODO/g) || []).length +
    (code.match(/FIXME/g) || []).length;

  if (todoCount > 0) {
    issues.push({
      title: "Technical debt markers",
      description: `Detected ${todoCount} TODO/FIXME comments.`,
      severity: "low"
    });
    improvements.push("Resolve TODO/FIXME comments.");
  }

  if (!code.includes("describe") && !code.includes("it(")) {
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

const model = mode === "full" ? "gpt-4.1" : "gpt-4.1-mini";
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
${code}
`
    }
  ],
  text: {
    format: {
      type: "json_object"
    }
  }
});

const parsed = JSON.parse(response.output_text);


  const validated = reviewResponseSchema.safeParse(parsed);

  if (!validated.success) {
    return {
      summary: "AI JSON did not match schema",
      issues: [],
      improvements: []
    };
  }

  return validated.data;
}