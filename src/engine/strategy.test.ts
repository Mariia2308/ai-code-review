import { describe, it, expect } from "vitest";
import { decideStrategy } from "./strategy.js";

describe("decideStrategy", () => {

  it("returns skipped for low risk", () => {
    expect(decideStrategy(0.1)).toBe("skipped");
  });

  it("returns full-ai for high risk", () => {
    expect(decideStrategy(0.9)).toBe("full-ai");
  });

  it("returns mini-ai for medium risk", () => {
    expect(decideStrategy(0.4)).toBe("mini-ai");
  });

});