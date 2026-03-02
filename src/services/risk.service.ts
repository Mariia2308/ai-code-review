import { RISK_HEURISTICS } from "../config/risk-heuristics.js";

export function calculateRisk(code: string) {
  const lines = code.split("\n").length;

  const anyCount = (code.match(/\bany\b/g) || []).length;
  const todoCount =
    (code.match(/TODO/g) || []).length +
    (code.match(/FIXME/g) || []).length;

  const {
    SIZE_THRESHOLDS,
    WEIGHTS,
    CAPS
  } = RISK_HEURISTICS;

  const factors = {
    sizeRisk: 0,
    typeRisk: 0,
    techDebtRisk: 0,
    testRisk: 0
  };

  // ---- SIZE RISK ----
  if (lines > SIZE_THRESHOLDS.MEDIUM) {
    factors.sizeRisk = WEIGHTS.SIZE_MEDIUM;
  }

  if (lines > SIZE_THRESHOLDS.LARGE) {
    factors.sizeRisk = WEIGHTS.SIZE_LARGE;
  }

  // ---- TYPE RISK ----
  factors.typeRisk = Math.min(
    anyCount * WEIGHTS.TYPE_ANY,
    CAPS.TYPE
  );

  // ---- TECH DEBT ----
  factors.techDebtRisk = Math.min(
    todoCount * WEIGHTS.TECH_DEBT,
    CAPS.TECH_DEBT
  );

  // ---- TEST COVERAGE ----
  if (!code.includes("describe") && !code.includes("it(")) {
    factors.testRisk = WEIGHTS.MISSING_TESTS;
  }

  const totalRisk =
    factors.sizeRisk +
    factors.typeRisk +
    factors.techDebtRisk +
    factors.testRisk;

  return {
    riskScore: Number(Math.min(totalRisk, 1).toFixed(3)),
    factors
  };
}