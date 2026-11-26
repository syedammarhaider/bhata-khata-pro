import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function DashboardSection({
  title,
  description,
  children,
  actionLabel,
  onAction,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`min-w-0 space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
          >
            {actionLabel}
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {children}
    </section>
  );
}
