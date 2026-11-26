// ============================================================
// FILE 173
// PATH: E:\BRICKSCS\src\features\sales\components\SalesFilters.tsx
// ============================================================

import { RotateCcw } from "lucide-react";
import { SALES_STATUSES, SALES_PAYMENT_STATUSES } from "../sales.constants";
import type { SalesFilters as Filters } from "../sales.types";

interface SalesFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function SalesFilters({
  filters,
  onChange,
}: SalesFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 xl:grid-cols-5 dark:border-slate-800 dark:bg-slate-900">
      <input
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="Search invoice or customer..."
        className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />

      <select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value })} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="all">All sale statuses</option>
        {SALES_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>

      <select value={filters.paymentStatus} onChange={(event) => onChange({ ...filters, paymentStatus: event.target.value })} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <option value="all">All payment statuses</option>
        {SALES_PAYMENT_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>

      <input type="date" value={filters.startDate} onChange={(event) => onChange({ ...filters, startDate: event.target.value })} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />

      <div className="flex gap-2">
        <input type="date" value={filters.endDate} onChange={(event) => onChange({ ...filters, endDate: event.target.value })} className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <button type="button" title="Reset filters" onClick={() => onChange({ search: "", status: "all", paymentStatus: "all", startDate: "", endDate: "" })} className="rounded-lg border px-3 dark:border-slate-700">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
