import type { ReactNode } from "react";

export interface PageTab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  count?: number;
}

interface PageTabsProps {
  tabs: PageTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function PageTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: PageTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Page sections"
      className={`flex w-full gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700 ${className}`}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              active
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.icon}
            {tab.label}

            {typeof tab.count === "number" && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
