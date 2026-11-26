// ============================================================
// FILE 234
// PATH: src/features/orders/components/OrderConvertToSale.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderConvertToSale({
  order,
  onConvert,
}: {
  order: Order;
  onConvert: (id: string) => void;
}) {
  return (
    <button
      disabled={order.status !== "confirmed" && order.status !== "completed"}
      onClick={() => onConvert(order.id)}
      className="btn-primary disabled:opacity-40"
    >
      Convert to sale
    </button>
  );
}
