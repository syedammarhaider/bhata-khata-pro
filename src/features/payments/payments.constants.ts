// FILE 410: src/features/payments/payments.constants.ts
import type { PaymentStatus } from "./payments.types";

export const PAYMENTS_STATUSES: readonly PaymentStatus[] = [
  "active",
  "inactive",
  "archived",
] as const;

export const PAYMENTS_PAGE_SIZE = 25;
export const PAYMENTS_MAX_NAME_LENGTH = 120;

export const PAYMENTS_STATUS_LABELS: Record<PaymentStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
