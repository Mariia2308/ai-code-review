import { describe, it, expect, beforeAll } from "vitest";
import { reviewCode } from "./review.service.js";

beforeAll(() => {
  process.env.MOCK = "true";
});

describe("reviewCode (mock mode)", () => {
  it("detects any usage", async () => {
    const result = await reviewCode("function a(x:any){}", "ts");

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.summary).toContain("mock");
  });

  it("detects missing tests", async () => {
    const result = await reviewCode("function a(){}", "ts");

    const hasTestIssue = result.issues.some(i =>
      i.title.includes("Missing")
    );

    expect(hasTestIssue).toBe(true);
  });
});