// ============================================================
// FILE 101
// PATH: E:\BRICKSCS\src\features\dashboard\components\InventoryOverview.tsx
// ============================================================

import {
  Boxes,
  Package,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import KpiCard from "./KpiCard";
import type { InventorySummary } from "../dashboard.types";
import { formatDashboardNumber } from "../dashboard.utils";

interface InventoryOverviewProps {
  data: InventorySummary;
}

export default function InventoryOverview({
  data,
}: InventoryOverviewProps) {
  const cards = [
    {
      title: "Total stock",
      value: data.totalStock,
      icon: <Boxes size={21} />,
      accent: "indigo" as const,
    },
    {
      title: "Available stock",
      value: data.availableStock,
      icon: <PackageCheck size={21} />,
      accent: "emerald" as const,
    },
    {
      title: "Reserved stock",
      value: data.reservedStock,
      icon: <Package size={21} />,
      accent: "blue" as const,
    },
    {
      title: "Damaged stock",
      value: data.damagedStock,
      icon: <AlertTriangle size={21} />,
      accent: "rose" as const,
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
          description="Brick detail"
        />
      ))}
    </div>
  );
}
