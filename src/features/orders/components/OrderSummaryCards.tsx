// ============================================================
// FILE 204
// PATH: src/features/orders/components/OrderSummaryCards.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderSummaryCards({ orders }: { orders: Order[] }) {
  const cards = [
    ["Total orders", orders.length],
    ["Pending", orders.filter((o) => o.status === "pending").length],
    ["Completed", orders.filter((o) => o.status === "completed").length],
    [
      "Outstanding",
      orders
        .reduce((s, o) => s + Math.max(0, o.total - o.paidAmount), 0)
        .toLocaleString(),
    ],
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
