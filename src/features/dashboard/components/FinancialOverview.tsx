// ============================================================
// Bhatta Khata Pro - Ultra Professional Financial Overview
// ============================================================

import {
  Banknote,
  TrendingUp,
  Wallet,
  CircleDollarSign,
  Scale,
} from "lucide-react";
import KpiCard from "./KpiCard";
import type { FinancialSummary } from "../dashboard.types";
import { formatDashboardCurrency } from "../dashboard.utils";

interface FinancialOverviewProps {
  data: FinancialSummary;
  currency?: string;
  periodLabel?: string;
}

export default function FinancialOverview({
  data,
  currency = "PKR",
  periodLabel = "Selected period",
}: FinancialOverviewProps) {
  const cards = [
    {
      title: "Total sales",
      value: data.totalSales,
      icon: <TrendingUp size={22} />,
      accent: "indigo" as const,
      description: periodLabel,
    },
    {
      title: "Total receive amount",
      value: data.totalReceipts,
      icon: <Banknote size={22} />,
      accent: "emerald" as const,
      description: "Cash / Bank collected",
    },
    {
      title: "Total expenses",
      value: data.totalExpenses,
      icon: <Wallet size={22} />,
      accent: "rose" as const,
      description: "Fuel, labour & overheads",
    },
    {
      title: "Pending amount",
      value: data.outstandingBalance,
      icon: <CircleDollarSign size={22} />,
      accent: "amber" as const,
      description: "Outstanding customer dues",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiCard
            key={card.title}
            title={card.title}
            value={formatDashboardCurrency(card.value, currency)}
            icon={card.icon}
            accent={card.accent}
            description={card.description}
          />
        ))}
      </div>

      {/* Net profit / cash balance indicator banner */}
      <div className="flex flex-wrap items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-2.5">
            <Scale size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Net Financial Position ({periodLabel})
            </p>
            <p className="text-lg font-bold">
              Net Cash Flow:{" "}
              <span
                className={
                  data.netCashFlow >= 0 ? "text-emerald-400" : "text-rose-400"
                }
              >
                {formatDashboardCurrency(data.netCashFlow, currency)}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-6 sm:mt-0 text-sm">
          <div>
            <span className="block text-xs text-slate-400">Total Collected</span>
            <span className="font-semibold text-emerald-400">
              {formatDashboardCurrency(data.totalReceipts, currency)}
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="block text-xs text-slate-400">Total Disbursed</span>
            <span className="font-semibold text-rose-300">
              {formatDashboardCurrency(data.totalExpenses, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
