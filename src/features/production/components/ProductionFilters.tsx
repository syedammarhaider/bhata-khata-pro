import { RotateCcw, Search } from "lucide-react";
import type { ProductionFiltersState } from "../production.types";
import {
  PRODUCTION_STAGES,
  PRODUCTION_STATUSES,
} from "../production.constants";

interface ProductionFiltersProps {
  filters: ProductionFiltersState;
  onChange: (filters: ProductionFiltersState) => void;
  onReset: () => void;
}

export default function ProductionFilters({
  filters,
  onChange,
  onReset,
}: ProductionFiltersProps) {
  const update = <K extends keyof ProductionFiltersState>(
    key: K,
    value: ProductionFiltersState[K],
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_160px_160px_150px_150px_auto] dark:border-slate-800 dark:bg-slate-900">
      <label className="relative">
        <span className="sr-only">Search production batches</span>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Search batch or grade"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <select
        aria-label="Filter by stage"
        value={filters.stage}
        onChange={(event) =>
          update("stage", event.target.value as ProductionFiltersState["stage"])
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="all">All stages</option>
        {PRODUCTION_STAGES.map((stage) => (
          <option key={stage.value} value={stage.value}>
            {stage.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) =>
          update("status", event.target.value as ProductionFiltersState["status"])
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="all">All statuses</option>
        {PRODUCTION_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        aria-label="Start date"
        value={filters.startDate}
        onChange={(event) => update("startDate", event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
      />

      <input
        type="date"
        aria-label="End date"
        value={filters.endDate}
        onChange={(event) => update("endDate", event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
      />

      <button
        type="button"
        onClick={onReset}
        title="Reset filters"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <RotateCcw size={15} />
        <span className="sm:hidden lg:inline">Reset</span>
      </button>
    </div>
  );
}
