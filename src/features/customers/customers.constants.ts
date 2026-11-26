// ============================================================
// FILE 320
// PATH: src/features/customers/customers.constants.ts
// ============================================================

import type {
  CustomerStatus,
  CustomerTransactionType,
} from "./customers.types";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const CUSTOMER_TRANSACTION_LABELS: Record<
  CustomerTransactionType,
  string
> = {
  sale: "Sale",
  payment: "Payment",
  return: "Return",
  adjustment: "Adjustment",
};

export const CUSTOMER_PAGE_SIZE = 10;
export const DEFAULT_CUSTOMER_CREDIT_LIMIT = 0;

export const CUSTOMER_PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Cheque",
  "Other",
];
