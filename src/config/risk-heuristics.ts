export const RISK_HEURISTICS = {
  SIZE_THRESHOLDS: {
    MEDIUM: 150,
    LARGE: 300
  },

  WEIGHTS: {
    SIZE_MEDIUM: 0.2,
    SIZE_LARGE: 0.4,
    TYPE_ANY: 0.05,
    TECH_DEBT: 0.03,
    MISSING_TESTS: 0.2
  },

  CAPS: {
    TYPE: 0.3,
    TECH_DEBT: 0.3
  }
} as const;