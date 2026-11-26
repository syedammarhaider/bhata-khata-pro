// ============================================================
// FILE 99
// PATH: E:\BRICKSCS\src\features\dashboard\components\ProductionOverview.tsx
// ============================================================

import {
  Boxes,
  PackageCheck,
  PackageOpen,
  AlertTriangle,
} from "lucide-react";
import KpiCard from "./KpiCard";
import type { ProductionSummary } from "../dashboard.types";
import { formatDashboardNumber } from "../dashboard.utils";

interface ProductionOverviewProps {
  data: ProductionSummary;
}

export default function ProductionOverview({
  data,
}: ProductionOverviewProps) {
  const cards = [
    {
      title: "Total produced",
      value: data.totalProduced,
      icon: <Boxes size={21} />,
      accent: "indigo" as const,
      description: "Bricks produced in selected period",
    },
    {
      title: "Total dispatched",
      value: data.totalDispatched,
      icon: <PackageCheck size={21} />,
      accent: "emerald" as const,
      description: "Bricks dispatched in selected period",
    },
    {
      title: "Available stock",
      value: data.availableStock,
      icon: <PackageOpen size={21} />,
      accent: "blue" as const,
      description: "Current available brick stock",
    },
    {
      title: "Damaged bricks",
      value: data.damagedBricks,
      icon: <AlertTriangle size={21} />,
      accent: "amber" as const,
      description: "Recorded damaged stock",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={formatDashboardNumber(card.value)}
          icon={card.icon}
          accent={card.accent}
          description={card.description}
        />
      ))}
    </div>
  );
}
