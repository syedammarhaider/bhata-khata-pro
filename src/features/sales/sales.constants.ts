// ============================================================
// FILE 164
// PATH: E:\BRICKSCS\src\features\sales\sales.constants.ts
// ============================================================

import type {
  SalePaymentMethod,
  SalePaymentStatus,
  SaleStatus,
  SaleReturnStatus,
} from "./sales.types";

export const SALES_BRICK_GRADES = [
  "A Grade",
  "B Grade",
  "C Grade",
  "Special Grade",
] as const;

export const SALES_STATUSES: {
  value: SaleStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const SALES_PAYMENT_STATUSES: {
  value: SalePaymentStatus;
  label: string;
}[] = [
  { value: "unpaid", label: "Unpaid" },
  { value: "partial", label: "Partially paid" },
  { value: "paid", label: "Paid" },
];

export const SALES_PAYMENT_METHODS: {
  value: SalePaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank transfer" },
  { value: "online", label: "Online payment" },
  { value: "cheque", label: "Cheque" },
];

export const SALES_RETURN_STATUSES: {
  value: SaleReturnStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const SALES_DEFAULTS = {
  currency: "PKR",
  taxRate: 0,
  discount: 0,
  quantityLimit: 100_000_000,
  priceLimit: 1_000_000,
};
