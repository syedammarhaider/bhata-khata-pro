// ============================================================
// FILE 136
// PATH: E:\BRICKSCS\src\features\production\components\ProductionReportSummary.tsx
// ============================================================

import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

import type { ProductionBatch } from "../production.types";
import {
  calculateProductionSummary,
  calculateGoodBricks,
  formatBrickQuantity,
} from "../production.utils";

interface ProductionReportSummaryProps {
  batches: ProductionBatch[];
}

export default function ProductionReportSummary({
  batches,
}: ProductionReportSummaryProps) {
  const summary = calculateProductionSummary(batches);

  const goodBricks = batches.reduce(
    (total, batch) =>
      total +
      calculateGoodBricks(
        batch.producedQuantity,
        batch.damagedQuantity,
      ),
    0,
  );

  const items = [
    {
      label: "Total batches",
      value: summary.totalBatches,
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Total produced",
      value: summary.totalProduced,
      icon: <Boxes size={20} />,
    },
    {
      label: "Good bricks",
      value: goodBricks,
      icon: <PackageCheck size={20} />,
    },
    {
      label: "Damaged bricks",
      value: summary.totalDamaged,
      icon: <AlertTriangle size={20} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {item.label}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {item.icon}
            </span>
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {formatBrickQuantity(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
