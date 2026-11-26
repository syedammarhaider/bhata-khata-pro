// ============================================================
// FILE 167
// PATH: E:\BRICKSCS\src\features\sales\components\SalesSummaryCards.tsx
// ============================================================

import {
  Receipt,
  Wallet,
  CreditCard,
  BadgePercent,
} from "lucide-react";

import type { SalesSummary } from "../sales.types";
import SalesMetricCard from "./SalesMetricCard";

interface SalesSummaryCardsProps {
  summary: SalesSummary;
}

export default function SalesSummaryCards({
  summary,
}: SalesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SalesMetricCard
        label="Total sales"
        value={summary.totalSales}
        icon={<Receipt size={20} />}
        currency
      />
      <SalesMetricCard
        label="Received"
        value={summary.totalReceived}
        icon={<Wallet size={20} />}
        currency
      />
      <SalesMetricCard
        label="Outstanding"
        value={summary.totalDue}
        icon={<CreditCard size={20} />}
        currency
      />
      <SalesMetricCard
        label="Discounts"
        value={summary.totalDiscount}
        icon={<BadgePercent size={20} />}
        currency
      />
    </div>
  );
}
