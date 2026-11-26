// ============================================================
// FILE 344
// PATH: src/features/customers/components/CustomerMetricCard.tsx
// ============================================================

import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function CustomerMetricCard({ title, value, icon }: Props) {
  return (
    <div className="rounded-xl border p-4 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
