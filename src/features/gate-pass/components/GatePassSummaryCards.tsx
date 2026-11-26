// ============================================================
// FILE 244
// PATH: src/features/gate-pass/components/GatePassSummaryCards.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassSummaryCards({ items }: { items: GatePass[] }) {
  const stats = [
    ["Total passes", items.length],
    ["Prepared", items.filter((p) => p.status === "prepared").length],
    ["Dispatched", items.filter((p) => p.status === "dispatched").length],
    ["Delivered", items.filter((p) => p.status === "delivered").length],
  ];
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map(([k, v]) => (
        <div key={k} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{k}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{v}</p>
        </div>
      ))}
    </div>
  );
}
