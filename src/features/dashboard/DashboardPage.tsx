import { useState, useEffect, useCallback } from "react";
import {
  Factory,
  RefreshCw,
  Database,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";

import DashboardSection from "./components/DashboardSection";
import DashboardWelcome from "./components/DashboardWelcome";
import DashboardFilters from "./components/DashboardFilters";
import DashboardEmptyState from "./components/DashboardEmptyState";
import ProductionTrendChart from "./components/ProductionTrendChart";
import ProductionOverview from "./components/ProductionOverview";
import FinancialOverview from "./components/FinancialOverview";
import InventoryOverview from "./components/InventoryOverview";
import LabourOverview from "./components/LabourOverview";
import ExpenseOverview from "./components/ExpenseOverview";

import {
  getCurrentDateRange,
  buildProductionTrend,
  toLocalDateString,
  formatDashboardCurrency,
} from "./dashboard.utils";

import type {
  DashboardPeriod,
  DashboardDateRange,
  DashboardData,
  FinancialSummary,
} from "./dashboard.types";

import {
  getDashboardData,
  getProductionBatches,
  getGatePasses,
  getSales,
  getExpenses,
  getInventory,
  getWorkers,
  getAttendance,
  getWages,
  getCoalFuel,
} from "../../lib/api";

interface DashboardPageProps {
  userName?: string;
  businessName?: string;
  currency?: string;
}

export default function DashboardPage({
  userName = "Administrator",
  businessName = "Your Brick Kiln",
  currency = "PKR",
}: DashboardPageProps) {
  const [period, setPeriod] = useState<DashboardPeriod>("month");

  const [dateRange, setDateRange] = useState<DashboardDateRange>(() =>
    getCurrentDateRange("month"),
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        apiData,
        batchRecords,
        passRecords,
        saleRecords,
        expenseRecords,
        inventoryRecords,
        workerRecords,
        attendanceRecords,
        wageRecords,
        fuelRecords,
      ] = await Promise.all([
        getDashboardData().catch(() => null),
        getProductionBatches().catch(() => []),
        getGatePasses().catch(() => []),
        getSales().catch(() => []),
        getExpenses().catch(() => []),
        getInventory().catch(() => []),
        getWorkers().catch(() => []),
        getAttendance().catch(() => []),
        getWages().catch(() => []),
        getCoalFuel().catch(() => []),
      ]);

      const todayKey = toLocalDateString(new Date());

      // Helper to check if a record falls within date range
      const inRange = (d?: string | null) => {
        if (!d) return false;
        const dateStr = d.slice(0, 10);
        return dateStr >= dateRange.startDate && dateStr <= dateRange.endDate;
      };

      const isToday = (d?: string | null) => (d ?? "").slice(0, 10) === todayKey;

      // ─── 1. Sales & Financial Calculations ──────────────────
      const activeSales = saleRecords.filter((s: any) => s.status !== "cancelled");
      const salesInPeriod = activeSales.filter((s: any) => inRange(s.sale_date));
      const salesToday = activeSales.filter((s: any) => isToday(s.sale_date));

      // Financial for selected period
      const periodSales = salesInPeriod.reduce(
        (sum: number, s: any) => sum + (s.grand_total ?? 0),
        0,
      );
      const periodPending = salesInPeriod.reduce(
        (sum: number, s: any) => sum + (s.due_amount ?? 0),
        0,
      );
      const periodReceipts = periodSales - periodPending;

      // Expenses in period
      const activeExpenses = expenseRecords.filter((e: any) => e.status !== "rejected");
      const expensesInPeriod = activeExpenses.filter((e: any) => inRange(e.expense_date));
      const periodExpenses = expensesInPeriod.reduce(
        (sum: number, e: any) => sum + (e.amount ?? 0),
        0,
      );

      const periodFinancial: FinancialSummary = {
        totalSales: periodSales,
        totalReceipts: periodReceipts,
        totalExpenses: periodExpenses,
        outstandingBalance: periodPending,
        netCashFlow: periodReceipts - periodExpenses,
      };

      // Financial for Today (1 Day)
      const todaySalesVal = salesToday.reduce(
        (sum: number, s: any) => sum + (s.grand_total ?? 0),
        0,
      );
      const todayPendingVal = salesToday.reduce(
        (sum: number, s: any) => sum + (s.due_amount ?? 0),
        0,
      );
      const todayReceiptsVal = todaySalesVal - todayPendingVal;

      const expensesToday = activeExpenses.filter((e: any) => isToday(e.expense_date));
      const todayExpensesVal = expensesToday.reduce(
        (sum: number, e: any) => sum + (e.amount ?? 0),
        0,
      );

      const todayFinancial: FinancialSummary = {
        totalSales: todaySalesVal,
        totalReceipts: todayReceiptsVal,
        totalExpenses: todayExpensesVal,
        outstandingBalance: todayPendingVal,
        netCashFlow: todayReceiptsVal - todayExpensesVal,
      };

      // ─── 2. Production & Dispatches in Period ──────────────────
      const batchesInPeriod = batchRecords.filter((b: any) =>
        inRange(b.completed_date || b.start_date),
      );
      const periodProduced = batchesInPeriod.reduce(
        (sum: number, b: any) =>
          sum + (b.produced_quantity || (b.status === "completed" ? b.planned_quantity : 0) || 0),
        0,
      );

      // Dispatches: actual bricks dispatched from Gate Passes in period
      const validPasses = passRecords.filter((p: any) => p.status !== "cancelled");
      const passesInPeriod = validPasses.filter((p: any) => inRange(p.dispatch_date));
      const periodDispatched = passesInPeriod.reduce(
        (sum: number, p: any) => sum + (p.quantity ?? 0),
        0,
      );

      // ─── 3. Inventory Stock Calculations ──────────────────────
      const totalInventoryStock = inventoryRecords.reduce(
        (sum: number, item: any) => sum + (item.quantity ?? 0),
        0,
      );
      const totalReservedStock = inventoryRecords.reduce(
        (sum: number, item: any) => sum + (item.reserved_quantity ?? 0),
        0,
      );
      const totalDamagedStock = inventoryRecords.reduce(
        (sum: number, item: any) => sum + (item.damaged_quantity ?? 0),
        0,
      );
      const totalAvailableStock = Math.max(0, totalInventoryStock - totalReservedStock);

      // ─── 4. Labour & Attendance Today ─────────────────────────
      const activeWorkers = workerRecords.filter((w: any) => w.status === "active");
      const totalWorkersCount = activeWorkers.length || (apiData?.total_workers ?? 0);

      const todayAttendance = attendanceRecords.filter((a: any) => isToday(a.attendance_date));
      const presentTodayCount = todayAttendance.filter(
        (a: any) => a.status === "present" || a.status === "half_day" || a.status === "late",
      ).length;
      const absentTodayCount = Math.max(0, totalWorkersCount - presentTodayCount);

      // Pending wages from wages table
      const pendingWagesTotal = wageRecords
        .filter((w: any) => w.status === "pending" || w.status === "unpaid")
        .reduce((sum: number, w: any) => sum + (w.net_amount ?? 0), 0);

      // ─── 5. Categorized Expenses ──────────────────────────────
      let fuelCost = 0;
      let labourCost = 0;
      let transportCost = 0;
      let otherCost = 0;

      expensesInPeriod.forEach((e: any) => {
        const cat = (e.category || "").toLowerCase();
        const amt = e.amount || 0;
        if (cat.includes("fuel") || cat.includes("coal") || cat.includes("کوئلہ")) {
          fuelCost += amt;
        } else if (cat.includes("labour") || cat.includes("wage") || cat.includes("مزدوری")) {
          labourCost += amt;
        } else if (cat.includes("transport") || cat.includes("vehicle") || cat.includes("گاڑی")) {
          transportCost += amt;
        } else {
          otherCost += amt;
        }
      });

      // Add fuel records cost if recorded in fuel module
      fuelRecords
        .filter((f: any) => inRange(f.purchase_date) && f.status !== "cancelled")
        .forEach((f: any) => {
          fuelCost += f.cost || 0;
        });

      // Production Trend
      const trend = buildProductionTrend(
        batchRecords,
        passRecords,
        dateRange.startDate,
        dateRange.endDate,
      );

      // Label description
      const periodNames: Record<DashboardPeriod, string> = {
        today: "Today (1 Day)",
        "1day": "Today (1 Day)",
        "2days": "Last 2 Days",
        "3days": "Last 3 Days",
        "4days": "Last 4 Days",
        week: "Last 7 Days (Week)",
        "15days": "Last 15 Days",
        month: "Last 30 Days (Month)",
        year: "Last 1 Year",
        custom: "Custom Range",
      };

      setDashboardData({
        production: {
          totalProduced: periodProduced || (apiData?.total_production ?? 0),
          totalDispatched: periodDispatched,
          availableStock: totalAvailableStock || (apiData?.total_inventory ?? 0),
          damagedBricks: totalDamagedStock,
        },
        financial: periodFinancial,
        todayFinancial,
        inventory: {
          totalStock: totalInventoryStock || (apiData?.total_inventory ?? 0),
          availableStock: totalAvailableStock || (apiData?.total_inventory ?? 0),
          reservedStock: totalReservedStock,
          damagedStock: totalDamagedStock,
        },
        labour: {
          totalWorkers: totalWorkersCount,
          presentWorkers: presentTodayCount || totalWorkersCount,
          absentWorkers: absentTodayCount,
          pendingWages: pendingWagesTotal,
        },
        expenses: {
          totalExpenses: periodExpenses + (fuelCost > periodExpenses ? fuelCost : 0),
          fuelExpenses: fuelCost,
          labourExpenses: labourCost,
          transportExpenses: transportCost,
          otherExpenses: otherCost,
        },
        productionTrend: trend,
        periodLabel: `${periodNames[period]} (${dateRange.startDate} to ${dateRange.endDate})`,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handlePeriodChange(nextPeriod: DashboardPeriod) {
    setPeriod(nextPeriod);
    if (nextPeriod !== "custom") {
      setDateRange(getCurrentDateRange(nextPeriod));
    }
  }

  function handleReset() {
    setPeriod("month");
    setDateRange(getCurrentDateRange("month"));
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your brick kiln operations and business performance."
          icon={Factory}
        />
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your brick kiln operations and business performance."
          icon={Factory}
        />
        <DashboardEmptyState
          title="Failed to load dashboard"
          description={error}
          icon={<Database size={27} />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Comprehensive real-time overview of your brick kiln operations, finances, stock, and labour."
        icon={Factory}
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin text-indigo-600" : "text-slate-500"}
            />
            Refresh Data
          </button>
        }
      />

      <DashboardWelcome userName={userName} businessName={businessName} />

      {/* Quick Interactive Period Selector (1 Day, 2 Days, 3 Days, 4 Days, 7 Days, Month, etc.) */}
      <DashboardFilters
        period={period}
        dateRange={dateRange}
        onPeriodChange={handlePeriodChange}
        onDateRangeChange={setDateRange}
        onReset={handleReset}
      />

      {dashboardData && (
        <>
          {/* 🌟 1-DAY (TODAY) SNAPSHOT BAR: Always shows first for 1 Day! */}
          <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-4 shadow-sm dark:border-indigo-900 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                  Today at a Glance &bull; 1-Day Operations Snapshot
                </h3>
              </div>
              <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
                {toLocalDateString(new Date())}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-indigo-100 bg-white/80 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/80">
                <span className="block text-xs font-medium text-slate-500">Today Sales</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {formatDashboardCurrency(dashboardData.todayFinancial.totalSales, currency)}
                </span>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/80 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/80">
                <span className="block text-xs font-medium text-slate-500">Today Received</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatDashboardCurrency(dashboardData.todayFinancial.totalReceipts, currency)}
                </span>
              </div>

              <div className="rounded-xl border border-rose-100 bg-white/80 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/80">
                <span className="block text-xs font-medium text-slate-500">Today Expenses</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                  {formatDashboardCurrency(dashboardData.todayFinancial.totalExpenses, currency)}
                </span>
              </div>

              <div className="rounded-xl border border-amber-100 bg-white/80 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/80">
                <span className="block text-xs font-medium text-slate-500">Today Pending</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                  {formatDashboardCurrency(dashboardData.todayFinancial.outstandingBalance, currency)}
                </span>
              </div>
            </div>
          </section>

          {/* 1. Production Overview (Accurate Produced & Dispatched count) */}
          <DashboardSection
            title="Production & Dispatch Overview"
            description={`Kiln output and brick dispatch information for ${dashboardData.periodLabel}.`}
          >
            <ProductionOverview data={dashboardData.production} />
          </DashboardSection>

          {/* 2. Financial Overview for Selected Period */}
          <DashboardSection
            title={`Financial Overview — ${dashboardData.periodLabel}`}
            description="Sales, receipts, operational expenses and outstanding balances in the selected window."
          >
            <FinancialOverview
              data={dashboardData.financial}
              currency={currency}
              periodLabel={dashboardData.periodLabel}
            />
          </DashboardSection>

          {/* 3. Ultra-Professional Production & Dispatch Trend Graph */}
          <ProductionTrendChart data={dashboardData.productionTrend} />

          {/* 4. Stock & Inventory Summary */}
          <DashboardSection
            title="Stock Summary & Brick Grades"
            description="Total inventory, available ready bricks, reserved orders and recorded damaged stock."
          >
            <InventoryOverview data={dashboardData.inventory} />
          </DashboardSection>

          {/* 5. Labour & Workforce Overview */}
          <DashboardSection
            title="Labour & Workforce Overview"
            description="Live worker attendance, today's presence, and pending calculated wages."
          >
            <LabourOverview data={dashboardData.labour} currency={currency} />
          </DashboardSection>

          {/* 6. Expense Breakdown (Fuel, Labour, Transport, Overheads) */}
          <DashboardSection
            title="Expense Breakdown & Cost Distribution"
            description="Categorized expenditure on coal/fuel, labour payroll, transport, and kiln maintenance."
          >
            <ExpenseOverview data={dashboardData.expenses} currency={currency} />
          </DashboardSection>
        </>
      )}
    </div>
  );
}
