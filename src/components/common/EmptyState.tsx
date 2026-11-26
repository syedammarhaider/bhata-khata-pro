
import type { ElementType, ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ElementType;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title = "No records found",
  description = "There is currently no data to display.",
  icon: Icon = Inbox,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-900 ${className}`}
      role="status"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon size={27} strokeWidth={1.6} />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
