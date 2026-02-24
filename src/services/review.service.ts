import { openai } from "./openai.service.js";
import { reviewResponseSchema } from "../schemas/review-response.schema.js";

export async function reviewCode(code: string, language?: string) {

if (process.env.MOCK === "true") {

  const issues = [];
  const improvements = [];

  const lines = code.split("\n").length;

  // 🔴 Type safety
  if (code.includes("any")) {
    issues.push({
      title: "Unsafe type usage",
      description: "Usage of 'any' reduces type safety.",
      severity: "medium"
    });
    improvements.push("Replace 'any' with explicit types.");
  }

  // 🔴 Technical debt
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


  // 🔴 Missing tests
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

  // 🔵 Real AI mode
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: `
Return ONLY valid JSON in this format:
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
  });

  const raw = response.output_text;

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      summary: "AI returned invalid JSON",
      issues: [],
      improvements: []
    };
  }

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