import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface ModuleShortcutProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  count?: string | number;
  disabled?: boolean;
}

export default function ModuleShortcut({
  title,
  description,
  icon,
  onClick,
  count,
  disabled = false,
}: ModuleShortcutProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-400">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </span>

          {count !== undefined && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {count}
            </span>
          )}
        </span>

        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>

      <ArrowUpRight
        size={17}
        className="shrink-0 text-slate-400 transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
      />
    </button>
  );
}
