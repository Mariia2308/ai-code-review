export function calculateRisk(code: string) {
  const lines = code.split("\n").length;

  const anyCount = (code.match(/any/g) || []).length;
  const todoCount =
    (code.match(/TODO/g) || []).length +
    (code.match(/FIXME/g) || []).length;

  const factors = {
    sizeRisk: 0,
    typeRisk: 0,
    techDebtRisk: 0,
    testRisk: 0
  };

  // 🔴 Size більш агресивний
  if (lines > 150) factors.sizeRisk = 0.2;
  if (lines > 300) factors.sizeRisk = 0.4;

  // 🔴 Type залежить від кількості any
  factors.typeRisk = Math.min(anyCount * 0.05, 0.3);

  // 🔴 TODO залежить від кількості
  factors.techDebtRisk = Math.min(todoCount * 0.03, 0.3);

  // 🔴 Відсутність тестів
  if (!code.includes("describe") && !code.includes("it(")) {
    factors.testRisk = 0.2;
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