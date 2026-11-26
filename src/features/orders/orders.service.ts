// ============================================================
// FILE 202
// PATH: src/features/orders/orders.service.ts
// ============================================================

import type { Order, OrderFormData } from "./orders.types";
import { calculateOrderTotal, validateOrder } from "./orders.utils";

export function prepareOrder(data: OrderFormData): Order {
  const errors = validateOrder(data);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const subtotal = data.items.reduce((s, i) => s + i.total, 0);
  return {
    ...data,
    id: crypto.randomUUID(),
    orderNumber: `ORD-${Date.now()}`,
    status: "pending",
    subtotal,
    total: calculateOrderTotal(data.items, data.discount),
    paidAmount: 0,
    createdAt: now,
  };
}

// This function prepares data only. Persistent SQLite saving is a later integration task.
