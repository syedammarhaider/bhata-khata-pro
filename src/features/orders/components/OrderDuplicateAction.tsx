// ============================================================
// FILE 233
// PATH: src/features/orders/components/OrderDuplicateAction.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderDuplicateAction({
  order,
  onDuplicate,
}: {
  order: Order;
  onDuplicate: (o: Order) => void;
}) {
  return (
    <button
      onClick={() =>
        onDuplicate({
          ...order,
          id: crypto.randomUUID(),
          orderNumber: `ORD-${Date.now()}`,
          status: "draft",
          paidAmount: 0,
          createdAt: new Date().toISOString(),
        })
      }
      className="text-blue-600"
    >
      Duplicate
    </button>
  );
}
