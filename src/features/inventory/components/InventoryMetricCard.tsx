// ============================================================
// FILE 288
// PATH: src/features/inventory/components/InventoryMetricCard.tsx
// ============================================================

import type { ReactNode } from "react";
import { LocalizedText } from "../../../lib/i18n";

interface Props {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}

export default function InventoryMetricCard({
  label,
  value,
  icon,
  description,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500"><LocalizedText text={label} /></p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-500"><LocalizedText text={description} /></p>
      )}
    </div>
  );
}
