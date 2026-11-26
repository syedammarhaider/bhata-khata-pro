// ============================================================
// FILE 103
// PATH: E:\BRICKSCS\src\features\dashboard\components\ExpenseOverview.tsx
// ============================================================

import {
  Flame,
  Users,
  Truck,
  Receipt,
} from "lucide-react";
import KpiCard from "./KpiCard";
import type { ExpenseSummary } from "../dashboard.types";
import { formatDashboardCurrency } from "../dashboard.utils";

interface ExpenseOverviewProps {
  data: ExpenseSummary;
  currency?: string;
}

export default function ExpenseOverview({
  data,
  currency = "PKR",
}: ExpenseOverviewProps) {
  const cards = [
    {
      title: "Fuel expenses",
      value: data.fuelExpenses,
      icon: <Flame size={21} />,
      accent: "amber" as const,
    },
    {
      title: "Labour expenses",
      value: data.labourExpenses,
      icon: <Users size={21} />,
      accent: "indigo" as const,
    },
    {
      title: "Transport expenses",
      value: data.transportExpenses,
      icon: <Truck size={21} />,
      accent: "blue" as const,
    },
    {
      title: "Other expenses",
      value: data.otherExpenses,
      icon: <Receipt size={21} />,
      accent: "rose" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={formatDashboardCurrency(card.value, currency)}
          icon={card.icon}
          accent={card.accent}
          description="Recorded expenses"
        />
      ))}
    </div>
  );
}
