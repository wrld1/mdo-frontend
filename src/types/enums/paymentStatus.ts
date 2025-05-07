export const Status = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export type PaymentStatus = (typeof Status)[keyof typeof Status];
