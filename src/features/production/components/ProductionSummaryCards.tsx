// ============================================================
// FILE 112
// PATH: E:\BRICKSCS\src\features\production\components\ProductionSummaryCards.tsx
// ============================================================

import {
  Factory,
  Boxes,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import ProductionMetricCard from "./ProductionMetricCard";
import type { ProductionSummary } from "../production.types";

interface ProductionSummaryCardsProps {
  summary: ProductionSummary;
}

export default function ProductionSummaryCards({
  summary,
}: ProductionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ProductionMetricCard
        title="Total batches"
        value={summary.totalBatches}
        icon={<Factory size={21} />}
        accent="indigo"
      />

      <ProductionMetricCard
        title="Total produced"
        value={summary.totalProduced}
        icon={<Boxes size={21} />}
        accent="emerald"
      />

      <ProductionMetricCard
        title="Damaged bricks"
        value={summary.totalDamaged}
        icon={<AlertTriangle size={21} />}
        accent="amber"
      />

      <ProductionMetricCard
        title="Completed batches"
        value={summary.completedBatches}
        icon={<CheckCircle2 size={21} />}
        accent="blue"
      />
    </div>
  );
}
