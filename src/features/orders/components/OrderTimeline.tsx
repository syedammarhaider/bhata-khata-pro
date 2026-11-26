// ============================================================
// FILE 215
// PATH: src/features/orders/components/OrderTimeline.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderTimeline({ order }: { order: Order }) {
  const steps = ["draft", "pending", "confirmed", "processing", "completed"];
  return (
    <ol className="flex flex-wrap gap-3">
      {steps.map((s, i) => (
        <li
          key={s}
          className={`rounded-lg px-3 py-2 text-xs ${
            steps.indexOf(order.status) >= i
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {i + 1}. {s}
        </li>
      ))}
    </ol>
  );
}
