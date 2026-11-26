// ============================================================
// Bhatta Khata Pro - Dashboard Filters
// Quick period selector pills + Custom Date Picker
// ============================================================

import { CalendarDays, RotateCcw, Clock } from "lucide-react";
import { DASHBOARD_PERIODS } from "../dashboard.constants";
import type {
  DashboardDateRange,
  DashboardPeriod,
} from "../dashboard.types";

interface DashboardFiltersProps {
  period: DashboardPeriod;
  dateRange: DashboardDateRange;
  onPeriodChange: (period: DashboardPeriod) => void;
  onDateRangeChange: (range: DashboardDateRange) => void;
  onReset?: () => void;
}

export default function DashboardFilters({
  period,
  dateRange,
  onPeriodChange,
  onDateRangeChange,
  onReset,
}: DashboardFiltersProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Operational Reporting Period
          </span>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {dateRange.startDate} to {dateRange.endDate}
          </span>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw size={13} />
            Reset to 1 Month
          </button>
        )}
      </div>

      {/* Quick period buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {DASHBOARD_PERIODS.map((item) => {
          const isActive =
            period === item.value ||
            (item.value === "1day" && period === "today");

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onPeriodChange(item.value)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Custom date range if selected */}
      {period === "custom" && (
        <div className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                onDateRangeChange({
                  ...dateRange,
                  startDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              To Date
            </label>
            <input
              type="date"
              min={dateRange.startDate || undefined}
              value={dateRange.endDate}
              onChange={(e) =>
                onDateRangeChange({
                  ...dateRange,
                  endDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 pb-2">
            <CalendarDays size={14} />
            Custom Date Filter Active
          </div>
        </div>
      )}
    </div>
  );
}
