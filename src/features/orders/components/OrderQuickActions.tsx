// ============================================================
// FILE 216
// PATH: src/features/orders/components/OrderQuickActions.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderQuickActions({
  order,
  onPrint,
  onCancel,
}: {
  order: Order;
  onPrint: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button onClick={onPrint} className="btn-secondary">
        Print
      </button>
      <button
        disabled={order.status === "completed" || order.status === "cancelled"}
        onClick={onCancel}
        className="text-red-600 disabled:opacity-40"
      >
        Cancel order
      </button>
    </div>
  );
}
