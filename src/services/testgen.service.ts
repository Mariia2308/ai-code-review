import { openai } from "./openai.service.js";

export async function generateTests(code: string, language?: string) {

  // ✅ MOCK режим
  if (process.env.MOCK === "true") {
    return {
      testFramework: "vitest",
      tests: `
import { describe, it, expect } from "vitest";
import { sum } from "./sum";

describe("sum", () => {
  it("adds positive numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("handles negative numbers", () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
`
    };
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are a senior engineer.

Generate unit tests using Vitest.

Return ONLY valid JSON:
{
  "testFramework": string,
  "tests": string
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
    parsed = {
      testFramework: "unknown",
      tests: "AI returned invalid JSON"
    };
  }

  return parsed;
}