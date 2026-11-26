
import type { ReactNode } from "react";
import { Filter, RotateCcw } from "lucide-react";

interface FilterBarProps {
  children: ReactNode;
  onReset?: () => void;
  title?: string;
  className?: string;
}

export default function FilterBar({
  children,
  onReset,
  title = "Filters",
  className = "",
}: FilterBarProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Filter size={16} />
          {title}
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {children}
      </div>
    </section>
  );
}
