
import type { ElementType } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  description?: string;
  trend?: string;
  trendDirection?: TrendDirection;
  iconColor?: string;
  iconBackground?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = "neutral",
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBackground = "bg-blue-50 dark:bg-blue-500/10",
  className = "",
}: StatCardProps) {
  const TrendIcon =
    trendDirection === "up"
      ? ArrowUpRight
      : trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  const trendColor =
    trendDirection === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : trendDirection === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-slate-500 dark:text-slate-400";

  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
        >
          <Icon size={21} strokeWidth={1.9} />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
              <TrendIcon size={14} />
              {trend}
            </span>
          )}

          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
