import { describe, it, expect } from "vitest";
import { calculateWeightedScore } from "./severity.js";

describe("calculateWeightedScore", () => {

  it("calculates weighted sum correctly", () => {
    const issues = [
      { severity: "low" },
      { severity: "medium" },
      { severity: "high" }
    ] as any;

    const score = calculateWeightedScore(issues);

    expect(score).toBe(6); // 1 + 2 + 3
  });

});