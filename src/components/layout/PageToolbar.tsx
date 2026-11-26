import type { ReactNode } from "react";

interface PageToolbarProps {
  title?: string;
  description?: string;
  leftContent?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageToolbar({
  title,
  description,
  leftContent,
  actions,
  className = "",
}: PageToolbarProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
        )}

        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {leftContent}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
