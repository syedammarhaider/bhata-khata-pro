import type { ReactNode } from "react";

interface ProductionMetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  accent: "indigo" | "emerald" | "amber" | "blue";
}

export default function ProductionMetricCard({
  title,
  value,
  icon,
  accent,
}: ProductionMetricCardProps) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    blue: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
        {new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(value)}
      </p>
    </div>
  );
}
