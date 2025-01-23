export const Status = {
  CLEAR: "CLEAR",
  SUSPENDED: "SUSPENDED",
  BLOCKED: "BLOCKED",
} as const;

export type FraudStatus = (typeof Status)[keyof typeof Status];
