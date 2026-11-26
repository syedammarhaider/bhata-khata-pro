// ============================================================
// FILE 132
// PATH: E:\BRICKSCS\src\features\production\components\ProductionBatchDetails.tsx
// ============================================================

import type { ProductionBatch } from "../production.types";
import ProductionProgress from "./ProductionProgress";
import ProductionStageBadge from "./ProductionStageBadge";
import ProductionStatusBadge from "./ProductionStatusBadge";
import {
  calculateGoodBricks,
  formatBrickQuantity,
  formatProductionDate,
} from "../production.utils";

interface ProductionBatchDetailsProps {
  batch: ProductionBatch;
}

export default function ProductionBatchDetails({
  batch,
}: ProductionBatchDetailsProps) {
  const goodQuantity = calculateGoodBricks(
    batch.producedQuantity,
    batch.damagedQuantity,
  );

  const items = [
    ["Batch number", batch.batchNumber],
    ["Brick grade", batch.brickGrade],
    ["Planned quantity", formatBrickQuantity(batch.quantity)],
    ["Produced quantity", formatBrickQuantity(batch.producedQuantity)],
    ["Good bricks", formatBrickQuantity(goodQuantity)],
    ["Damaged bricks", formatBrickQuantity(batch.damagedQuantity)],
    ["Start date", formatProductionDate(batch.startDate)],
    ["Expected date", formatProductionDate(batch.expectedDate)],
    ["Completed date", formatProductionDate(batch.completedDate)],
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {batch.batchNumber}
        </h2>

        <div className="flex gap-2">
          <ProductionStageBadge stage={batch.stage} />
          <ProductionStatusBadge status={batch.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {value}
            </p>
          </div>
        ))}
      </div>

      <ProductionProgress currentStage={batch.stage} />

      {batch.notes && (
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500">Notes</p>
          <p className="mt-1 text-sm">{batch.notes}</p>
        </div>
      )}
    </div>
  );
}
