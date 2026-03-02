import { describe, it, expect } from "vitest";
import { hashToUnit } from "./hash.js";

describe("hashToUnit", () => {
  it("returns number between 0 and 1", () => {
    const val = hashToUnit("test");
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(1);
  });

  it("is deterministic", () => {
    const a = hashToUnit("abc");
    const b = hashToUnit("abc");
    expect(a).toBe(b);
  });
});