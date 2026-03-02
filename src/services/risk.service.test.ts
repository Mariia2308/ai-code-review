import { describe, it, expect } from "vitest";
import { calculateRisk } from "./risk.service.js";

describe("calculateRisk", () => {

  it("returns low risk for small clean code", () => {
    const code = `
      function add(a: number, b: number) {
        return a + b;
      }
    `;

    const result = calculateRisk(code);

    expect(result.riskScore).toBeLessThan(0.3);
  });

  it("detects usage of any", () => {
    const code = `
      const value: any = 5;
    `;

    const result = calculateRisk(code);

    expect(result.riskScore).toBeGreaterThan(0);
  });

});