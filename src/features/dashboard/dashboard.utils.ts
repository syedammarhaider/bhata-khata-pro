// ============================================================
// Bhatta Khata Pro - Dashboard Utilities
// ============================================================

import type {
  DashboardDateRange,
  DashboardPeriod,
  ProductionTrendItem,
} from "./dashboard.types";

export function formatDashboardCurrency(
  value: number,
  currency = "PKR",
): string {
  if (!Number.isFinite(value)) return `${currency} 0`;

  return `${currency} ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatDashboardNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculatePercentageChange(
  current: number,
  previous: number,
): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return null;
  }

  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

export function getCurrentDateRange(
  period: DashboardPeriod,
): DashboardDateRange {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  if (period === "1day" || period === "today") {
    // Today
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "2days") {
    // 2 days
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "3days") {
    // 3 days
    start.setDate(start.getDate() - 2);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "4days") {
    // 4 days
    start.setDate(start.getDate() - 3);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "week") {
    // 7 days
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "15days") {
    // 15 days
    start.setDate(start.getDate() - 14);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "month") {
    // 30 days
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "year") {
    // 365 days
    start.setFullYear(start.getFullYear() - 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return {
    startDate: toLocalDateString(start),
    endDate: toLocalDateString(end),
  };
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDashboardDate(date: string): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function buildProductionTrend(
  batches: {
    produced_quantity?: number;
    planned_quantity?: number;
    status?: string;
    start_date?: string;
    completed_date?: string | null;
  }[],
  gatePasses: {
    quantity?: number;
    status?: string;
    dispatch_date?: string;
  }[],
  startDate: string,
  endDate: string,
): ProductionTrendItem[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return [];
  }

  const days =
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const mode = days <= 31 ? "day" : days <= 200 ? "week" : "month";

  const weekStart = (date: Date) => {
    const d = new Date(date);
    const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
    d.setDate(d.getDate() + diff);
    return toLocalDateString(d);
  };

  const keyOf = (date: Date) => {
    if (mode === "month") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }
    if (mode === "week") return weekStart(date);
    return toLocalDateString(date);
  };

  const labelOf = (key: string) => {
    const d = new Date(`${key.slice(0, 10)}T00:00:00`);
    if (mode === "month") {
      return d.toLocaleString("en", { month: "short" });
    }
    return d.toLocaleString("en", { day: "numeric", month: "short" });
  };

  const buckets = new Map<string, ProductionTrendItem>();
  const cursor = new Date(start);

  if (mode === "week") {
    cursor.setTime(new Date(weekStart(cursor) + "T00:00:00").getTime());
  } else if (mode === "month") {
    cursor.setDate(1);
  }

  while (cursor <= end) {
    const key = keyOf(cursor);
    if (!buckets.has(key)) {
      buckets.set(key, { label: labelOf(key), produced: 0, dispatched: 0 });
    }
    if (mode === "day") cursor.setDate(cursor.getDate() + 1);
    else if (mode === "week") cursor.setDate(cursor.getDate() + 7);
    else cursor.setMonth(cursor.getMonth() + 1);
  }

  const addTo = (dateStr: string | null | undefined, field: "produced" | "dispatched", amount: number) => {
    if (!dateStr || amount <= 0) return;
    const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(d.getTime()) || d < start || d > end) return;
    const bucket = buckets.get(keyOf(d));
    if (bucket) bucket[field] += amount;
  };

  batches.forEach((batch) => {
    const produced =
      (batch.produced_quantity ?? 0) > 0
        ? batch.produced_quantity!
        : batch.status === "completed"
          ? batch.planned_quantity ?? 0
          : 0;
    addTo(batch.completed_date || batch.start_date, "produced", produced);
  });

  gatePasses.forEach((pass) => {
    if (pass.status === "cancelled") return;
    addTo(pass.dispatch_date, "dispatched", pass.quantity ?? 0);
  });

  return [...buckets.values()];
}

export function getTrendDirection(
  current: number,
  previous: number,
): "up" | "down" | "neutral" {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "neutral";
}
