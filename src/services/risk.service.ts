export function calculateRisk(code: string) {
  const lines = code.split("\n").length;

  const factors = {
    sizeRisk: 0,
    typeRisk: 0,
    techDebtRisk: 0,
    testRisk: 0
  };

  // 🔹 Size risk
  if (lines > 300) {
    factors.sizeRisk = 0.4;
  } else if (lines > 150) {
    factors.sizeRisk = 0.2;
  }

  // 🔹 Type risk
  if (code.includes("any")) {
    factors.typeRisk = 0.2;
  }

  // 🔹 Technical debt
  if (code.includes("TODO") || code.includes("FIXME")) {
    factors.techDebtRisk = 0.2;
  }

  // 🔹 Missing tests
  if (!code.includes("test") && !code.includes("describe")) {
    factors.testRisk = 0.3;
  }

  const totalRisk =
    factors.sizeRisk +
    factors.typeRisk +
    factors.techDebtRisk +
    factors.testRisk;

  return {
    riskScore: Math.min(totalRisk, 1),
    factors,
    explanation: generateExplanation(factors)
  };
}

function generateExplanation(factors: any) {
  const reasons = [];

  if (factors.sizeRisk > 0) {
    reasons.push("Large code change increases review complexity.");
  }

  if (factors.typeRisk > 0) {
    reasons.push("Usage of 'any' reduces type safety.");
  }

  if (factors.techDebtRisk > 0) {
    reasons.push("Code contains TODO or FIXME markers.");
  }

  if (factors.testRisk > 0) {
    reasons.push("No evidence of unit tests detected.");
  }

  return reasons;
}