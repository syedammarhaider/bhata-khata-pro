
import type { ElementType, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ElementType;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

import { useState } from "react";

export default function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className = "",
  contentClassName = "",
  collapsible = false,
  defaultCollapsed = false,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <section
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Icon size={18} />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {action}

          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed((previous) => !previous)}
              aria-label={collapsed ? "Expand section" : "Collapse section"}
              aria-expanded={!collapsed}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronDown
                size={17}
                className={`transition-transform ${collapsed ? "-rotate-90" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className={`p-4 sm:p-5 ${contentClassName}`}>
          {children}
        </div>
      )}
    </section>
  );
}
