export const RISK_THRESHOLDS = {
  skip: 0.2,
  full: 0.6
} as const;

export const RISK_MODEL_CONFIG = {
  sizeThreshold: 150,
  todoWeight: 0.1,
  anyWeight: 0.2,
  missingTestsWeight: 0.3
};

export const AB_TEST_CONFIG = {
  miniTrafficRatio: 0.5
} as const;