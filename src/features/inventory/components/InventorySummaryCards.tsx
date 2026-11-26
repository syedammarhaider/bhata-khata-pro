// ============================================================
// FILE 284
// PATH: src/features/inventory/components/InventorySummaryCards.tsx
// ============================================================

import {
  Boxes,
  Package,
  AlertTriangle,
  Ban,
} from "lucide-react";
import StatCard from "../../../components/common/StatCard";
import type { InventorySummary } from "../inventory.types";

interface Props {
  summary: InventorySummary;
}

export default function InventorySummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Stock Items"
        value={summary.totalItems}
        icon={Package}
      />
      <StatCard
        title="Total Bricks"
        value={summary.totalQuantity.toLocaleString()}
        icon={Boxes}
      />
      <StatCard
        title="Low Stock"
        value={summary.lowStockItems}
        icon={AlertTriangle}
      />
      <StatCard
        title="Out of Stock"
        value={summary.outOfStockItems}
        icon={Ban}
      />
    </div>
  );
}
