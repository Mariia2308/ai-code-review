import { openai } from "./openai.service.js";
import { reviewResponseSchema } from "../schemas/review-response.schema.js";

export async function reviewCode(code: string, language?: string) {

  // 🔵 Intelligent MOCK
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
    if (code.includes("TODO") || code.includes("FIXME")) {
      issues.push({
        title: "Technical debt marker",
        description: "Code contains TODO or FIXME comments.",
        severity: "low"
      });
      improvements.push("Resolve TODO/FIXME comments.");
    }

    // 🔴 Large file
    if (lines > 200) {
      issues.push({
        title: "Large change",
        description: "File is large, increasing review complexity.",
        severity: "high"
      });
      improvements.push("Consider splitting into smaller modules.");
    }

    // 🔴 Missing tests
    if (!code.includes("describe") && !code.includes("it(")) {
      issues.push({
        title: "Missing unit tests",
        description: "No test cases detected in the file.",
        severity: "high"
      });
      improvements.push("Add unit tests for critical logic.");
    }

    return {
      summary: "Deterministic mock review based on rule analysis.",
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