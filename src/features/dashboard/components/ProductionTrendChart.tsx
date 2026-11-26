// ============================================================
// Bhatta Khata Pro - Ultra Professional Production Trend Graph
// ============================================================

import { useMemo, useState } from "react";
import { TrendingUp, Layers } from "lucide-react";
import type { ProductionTrendItem } from "../dashboard.types";
import { formatDashboardNumber } from "../dashboard.utils";

interface ProductionTrendChartProps {
  data: ProductionTrendItem[];
  title?: string;
  height?: number;
}

export default function ProductionTrendChart({
  data,
  title = "Production & Dispatch Trend Analysis",
  height = 240,
}: ProductionTrendChartProps) {
  const [hoveredItem, setHoveredItem] = useState<ProductionTrendItem | null>(null);

  const stats = useMemo(() => {
    let maxProduced = 0;
    let maxDispatched = 0;
    let totalProduced = 0;
    let totalDispatched = 0;

    data.forEach((item) => {
      totalProduced += item.produced;
      totalDispatched += item.dispatched;
      if (item.produced > maxProduced) maxProduced = item.produced;
      if (item.dispatched > maxDispatched) maxDispatched = item.dispatched;
    });

    const maxValue = Math.max(1, maxProduced, maxDispatched);
    return { maxValue, maxProduced, maxDispatched, totalProduced, totalDispatched };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <div className="flex min-h-56 flex-col items-center justify-center text-sm text-slate-500">
          <Layers className="mb-2 h-8 w-8 text-slate-300" />
          <p>No production or dispatch records found for this period.</p>
        </div>
      </div>
    );
  }

  const chartHeight = Math.max(160, height - 60);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time daily kilning output vs delivery trucks leaving the facility
          </p>
        </div>

        {/* Legend & quick summary metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 dark:bg-indigo-950/60">
            <span className="h-3 w-3 rounded bg-indigo-600 shadow-sm" />
            <span className="font-semibold text-indigo-900 dark:text-indigo-200">
              Produced: {formatDashboardNumber(stats.totalProduced)}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 dark:bg-emerald-950/60">
            <span className="h-3 w-3 rounded bg-emerald-500 shadow-sm" />
            <span className="font-semibold text-emerald-900 dark:text-emerald-200">
              Dispatched: {formatDashboardNumber(stats.totalDispatched)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart Area with grid and bars */}
      <div className="relative">
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-x-0 flex flex-col justify-between"
          style={{ height: chartHeight }}
        >
          <div className="border-b border-slate-100 dark:border-slate-800/80 w-full" />
          <div className="border-b border-slate-100 dark:border-slate-800/80 w-full" />
          <div className="border-b border-slate-100 dark:border-slate-800/80 w-full" />
          <div className="border-b border-slate-200 dark:border-slate-800 w-full" />
        </div>

        <div className="relative flex items-end gap-2 overflow-x-auto pb-2 pt-6">
          {data.map((item) => {
            const producedHeight = (item.produced / stats.maxValue) * chartHeight;
            const dispatchedHeight = (item.dispatched / stats.maxValue) * chartHeight;
            const isHovered = hoveredItem?.label === item.label;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group flex min-w-14 flex-1 flex-col items-center gap-2 rounded-xl p-1.5 transition-all ${
                  isHovered ? "bg-slate-100/80 dark:bg-slate-800/80" : ""
                }`}
              >
                {/* Bars column */}
                <div
                  className="relative flex w-full items-end justify-center gap-1.5"
                  style={{ height: chartHeight }}
                >
                  {/* Produced Bar */}
                  <div
                    className="relative w-3.5 rounded-t-md bg-gradient-to-t from-indigo-700 to-indigo-500 shadow-sm transition-all duration-300 group-hover:brightness-110"
                    style={{ height: Math.max(3, producedHeight) }}
                  >
                    {item.produced > 0 && isHovered && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                        {formatDashboardNumber(item.produced)}
                      </span>
                    )}
                  </div>

                  {/* Dispatched Bar */}
                  <div
                    className="relative w-3.5 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm transition-all duration-300 group-hover:brightness-110"
                    style={{ height: Math.max(3, dispatchedHeight) }}
                  >
                    {item.dispatched > 0 && isHovered && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                        {formatDashboardNumber(item.dispatched)}
                      </span>
                    )}
                  </div>
                </div>

                {/* X Axis Label */}
                <span
                  className={`max-w-full truncate text-[11px] font-medium transition-colors ${
                    isHovered
                      ? "text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover tooltip card */}
      {hoveredItem && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-2 text-xs text-white shadow-lg dark:bg-slate-800">
          <span className="font-bold">{hoveredItem.label} Details:</span>
          <div className="flex gap-4">
            <span className="text-indigo-300">
              Produced: <strong>{formatDashboardNumber(hoveredItem.produced)} bricks</strong>
            </span>
            <span className="text-emerald-300">
              Dispatched: <strong>{formatDashboardNumber(hoveredItem.dispatched)} bricks</strong>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
