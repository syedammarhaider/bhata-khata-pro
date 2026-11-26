// ============================================================
// FILE 102
// PATH: E:\BRICKSCS\src\features\dashboard\components\LabourOverview.tsx
// ============================================================

import {
  Users,
  UserCheck,
  UserX,
  Wallet,
} from "lucide-react";
import KpiCard from "./KpiCard";
import type { LabourSummary } from "../dashboard.types";
import { formatDashboardCurrency, formatDashboardNumber } from "../dashboard.utils";

interface LabourOverviewProps {
  data: LabourSummary;
  currency?: string;
}

export default function LabourOverview({
  data,
  currency = "PKR",
}: LabourOverviewProps) {
  const cards = [
    {
      title: "Total workers",
      value: formatDashboardNumber(data.totalWorkers),
      icon: <Users size={21} />,
      accent: "indigo" as const,
    },
    {
      title: "Present today",
      value: formatDashboardNumber(data.presentWorkers),
      icon: <UserCheck size={21} />,
      accent: "emerald" as const,
    },
    {
      title: "Absent today",
      value: formatDashboardNumber(data.absentWorkers),
      icon: <UserX size={21} />,
      accent: "amber" as const,
    },
    {
      title: "Pending wages",
      value: formatDashboardCurrency(data.pendingWages, currency),
      icon: <Wallet size={21} />,
      accent: "rose" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          accent={card.accent}
          description="Labour management"
        />
      ))}
    </div>
  );
}
