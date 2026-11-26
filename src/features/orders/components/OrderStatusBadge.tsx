// ============================================================
// FILE 210
// PATH: src/features/orders/components/OrderStatusBadge.tsx
// ============================================================

import type { OrderStatus } from "../orders.types";
import { ORDER_STATUS_LABELS } from "../orders.constants";

const styles: Record<OrderStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-violet-100 text-violet-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
