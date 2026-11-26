import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    direction: TrendDirection;
    label?: string;
  };
  accent?: "indigo" | "emerald" | "amber" | "rose" | "blue";
  onClick?: () => void;
}

const accentClasses = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
};

export default function KpiCard({
  title,
  value,
  description,
  icon,
  trend,
  accent = "indigo",
  onClick,
}: KpiCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${accentClasses[accent]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              trend.direction === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : trend.direction === "down"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight size={14} />
            ) : trend.direction === "down" ? (
              <ArrowDownRight size={14} />
            ) : (
              <Minus size={14} />
            )}
            {trend.value}
            {trend.label && (
              <span className="font-normal text-slate-500 dark:text-slate-400">
                {trend.label}
              </span>
            )}
          </span>
        )}
      </div>
    </>
  );

  const classes =
    "w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-900";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${classes} hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:hover:border-indigo-800`}
      >
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
