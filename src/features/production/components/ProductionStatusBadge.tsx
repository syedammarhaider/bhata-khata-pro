import type { ProductionStatus } from "../production.types";

interface ProductionStatusBadgeProps {
  status: ProductionStatus;
}

export default function ProductionStatusBadge({
  status,
}: ProductionStatusBadgeProps) {
  const styles: Record<ProductionStatus, string> = {
    planned:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    in_progress:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
    completed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    cancelled:
      "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  };

  const labels: Record<ProductionStatus, string> = {
    planned: "Planned",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
