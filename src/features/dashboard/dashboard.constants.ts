// ============================================================
// Bhatta Khata Pro - Dashboard Constants
// ============================================================

import type { DashboardPeriod } from "./dashboard.types";

export const DASHBOARD_PERIODS: {
  value: DashboardPeriod;
  label: string;
  days?: number;
}[] = [
  { value: "1day", label: "1 Day (Today)", days: 1 },
  { value: "2days", label: "2 Days", days: 2 },
  { value: "3days", label: "3 Days", days: 3 },
  { value: "4days", label: "4 Days", days: 4 },
  { value: "week", label: "7 Days (Week)", days: 7 },
  { value: "15days", label: "15 Days", days: 15 },
  { value: "month", label: "1 Month (30 Days)", days: 30 },
  { value: "year", label: "1 Year", days: 365 },
  { value: "custom", label: "Custom Range" },
];

export const DASHBOARD_REFRESH_INTERVAL = 60_000;

export const DASHBOARD_CHART_COLORS = {
  production: "#4f46e5",
  dispatch: "#10b981",
  warning: "#f59e0b",
  danger: "#e11d48",
};

export const DASHBOARD_EMPTY_LABEL = "No records available";
export const DASHBOARD_DEFAULT_CURRENCY = "PKR";

export const DASHBOARD_SECTION_IDS = {
  production: "production-overview",
  financial: "financial-overview",
  inventory: "inventory-overview",
  labour: "labour-overview",
  expenses: "expense-overview",
  activity: "recent-activity",
};
