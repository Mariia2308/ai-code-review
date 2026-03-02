import { describe, it, expect, beforeEach } from "vitest";
import { executeReviewDecision } from "./review-decision.engine.js";

describe("executeReviewDecision", () => {

  beforeEach(() => {
    process.env.MOCK = "true";
  });

it("returns a valid strategy for simple code", async () => {
  const result = await executeReviewDecision("const a = 1;");

  expect(["skipped", "mini-ai", "full-ai"]).toContain(result.strategy);
});

  it("returns weighted score correctly", async () => {
    const code = `
      const x: any = 5;
      // TODO: fix
    `;

    const result = await executeReviewDecision(code);

    expect(result.weightedScore).toBeGreaterThan(0);
  });

});