// FILE 491: src/features/labour/components/WorkerWageSummary.tsx
import type { ReactNode } from "react";

export interface WorkerWageSummaryProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function WorkerWageSummary({ title = "Worker Wage Summary", description, children, className = "" }: WorkerWageSummaryProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {children ?? <p className="text-sm text-slate-500">This section is ready for labour & workers data integration.</p>}
    </section>
  );
}

export default WorkerWageSummary;
