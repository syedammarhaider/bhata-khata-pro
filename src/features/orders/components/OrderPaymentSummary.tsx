// ============================================================
// FILE 214
// PATH: src/features/orders/components/OrderPaymentSummary.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderPaymentSummary({ order }: { order: Order }) {
  const balance = Math.max(0, order.total - order.paidAmount);
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
      <p className="text-sm text-slate-500">Payment status</p>
      <p className="font-semibold">
        {balance === 0 ? "Paid" : order.paidAmount > 0 ? "Partially paid" : "Unpaid"}
      </p>
      <p className="mt-1 text-sm">Remaining: {balance.toLocaleString()}</p>
    </div>
  );
}
