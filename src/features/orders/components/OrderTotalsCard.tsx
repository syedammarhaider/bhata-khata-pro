// ============================================================
// FILE 213
// PATH: src/features/orders/components/OrderTotalsCard.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderTotalsCard({ order }: { order: Order }) {
  return (
    <div className="space-y-2 rounded-xl border p-4">
      <p>Subtotal: {order.subtotal.toLocaleString()}</p>
      <p>Discount: {order.discount.toLocaleString()}</p>
      <p className="font-semibold">Total: {order.total.toLocaleString()}</p>
      <p>Paid: {order.paidAmount.toLocaleString()}</p>
      <p>Balance: {Math.max(0, order.total - order.paidAmount).toLocaleString()}</p>
    </div>
  );
}
