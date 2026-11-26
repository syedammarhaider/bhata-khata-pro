// ============================================================
// Bhatta Khata Pro - Dashboard Types
// ============================================================

export type DashboardPeriod =
  | "today"
  | "1day"
  | "2days"
  | "3days"
  | "4days"
  | "week"
  | "15days"
  | "month"
  | "year"
  | "custom";

export interface DashboardDateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardMetric {
  value: number;
  previousValue?: number;
  label?: string;
}

export interface ProductionTrendItem {
  label: string;
  produced: number;
  dispatched: number;
}

export interface FinancialSummary {
  totalSales: number;
  totalReceipts: number;
  totalExpenses: number;
  outstandingBalance: number;
  netCashFlow: number;
}

export interface ProductionSummary {
  totalProduced: number;
  totalDispatched: number;
  availableStock: number;
  damagedBricks: number;
}

export interface InventorySummary {
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  damagedStock: number;
}

export interface LabourSummary {
  totalWorkers: number;
  presentWorkers: number;
  absentWorkers: number;
  pendingWages: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  fuelExpenses: number;
  labourExpenses: number;
  transportExpenses: number;
  otherExpenses: number;
}

export interface DashboardData {
  production: ProductionSummary;
  financial: FinancialSummary;
  todayFinancial: FinancialSummary;
  inventory: InventorySummary;
  labour: LabourSummary;
  expenses: ExpenseSummary;
  productionTrend: ProductionTrendItem[];
  periodLabel: string;
  lastUpdated?: string;
}

export interface DashboardFilterState {
  period: DashboardPeriod;
  dateRange: DashboardDateRange;
}
