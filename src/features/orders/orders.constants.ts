// ============================================================
// FILE 200
// PATH: src/features/orders/orders.constants.ts
// ============================================================

import type { OrderStatus } from "./orders.types";

export const ORDER_STATUSES: OrderStatus[] = [
  "draft",
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const DEFAULT_ORDER_FILTERS = {
  search: "",
  status: "all" as const,
  fromDate: "",
  toDate: "",
};

export const ORDER_REFERENCE_PREFIX = "ORD";
export const ORDER_PAGE_SIZE = 20;
