// ============================================================
// FILE 230
// PATH: src/features/orders/components/OrderCustomerSummary.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderCustomerSummary({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-slate-500">Customer</p>
      <p className="font-medium">{order.customerName}</p>
      <p className="mt-1 text-xs text-slate-500">Customer ID: {order.customerId}</p>
    </div>
  );
}
