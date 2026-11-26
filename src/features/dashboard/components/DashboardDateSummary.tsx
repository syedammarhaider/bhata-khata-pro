// ============================================================
// FILE 106
// PATH: E:\BRICKSCS\src\features\dashboard\components\DashboardDateSummary.tsx
// ============================================================

import { CalendarDays } from "lucide-react";
import type { DashboardDateRange } from "../dashboard.types";
import { formatDashboardDate } from "../dashboard.utils";

interface DashboardDateSummaryProps {
  dateRange: DashboardDateRange;
  label?: string;
}

export default function DashboardDateSummary({
  dateRange,
  label = "Selected reporting period",
}: DashboardDateSummaryProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
        <CalendarDays size={18} />
      </span>

      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
          {formatDashboardDate(dateRange.startDate)}
          {" — "}
          {formatDashboardDate(dateRange.endDate)}
        </p>
      </div>
    </div>
  );
}
