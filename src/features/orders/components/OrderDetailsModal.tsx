// ============================================================
// FILE 211
// PATH: src/features/orders/components/OrderDetailsModal.tsx
// ============================================================

import type { Order } from "../orders.types";
import { OrderItemsTable } from "./OrderItemsTable";

export function OrderDetailsModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 dark:bg-slate-900">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <p className="mt-2">
          {order.customerName} · {order.status}
        </p>
        <p>Total: {order.total.toLocaleString()}</p>
        <OrderItemsTable items={order.items} />
        <p className="mt-3">
          Balance: {Math.max(0, order.total - order.paidAmount).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
