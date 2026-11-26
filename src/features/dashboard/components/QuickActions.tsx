import type { ReactNode } from "react";

export interface QuickActionItem {
  id: string;
  label: string;
  description?: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
  title?: string;
}

export default function QuickActions({
  actions,
  title = "Quick actions",
}: QuickActionsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {action.icon}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {action.label}
              </span>

              {action.description && (
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {action.description}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
