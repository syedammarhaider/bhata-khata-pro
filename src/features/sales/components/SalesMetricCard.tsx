// ============================================================
// FILE 184
// PATH: E:\BRICKSCS\src\features\sales\components\SalesMetricCard.tsx
// ============================================================

import type { ReactNode } from "react";

interface SalesMetricCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  description?: string;
  currency?: boolean;
}

export default function SalesMetricCard({ label, value, icon, description, currency = false }: SalesMetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
        {currency ? "PKR " : ""}{value.toLocaleString("en-PK", { maximumFractionDigits: 2 })}
      </p>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
    </div>
  );
}
