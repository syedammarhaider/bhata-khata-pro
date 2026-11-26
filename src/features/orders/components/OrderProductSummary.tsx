// ============================================================
// FILE 231
// PATH: src/features/orders/components/OrderProductSummary.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderProductSummary({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">Products ordered</p>
      {order.items.map((i) => (
        <p key={i.id} className="mt-1 text-sm">
          {i.productName} · {i.grade} · {i.quantity.toLocaleString()}
        </p>
      ))}
    </div>
  );
}
