// ============================================================
// FILE 110
// PATH: E:\BRICKSCS\src\features\production\production.utils.ts
// ============================================================

import type {
  ProductionBatch,
  ProductionFiltersState,
  ProductionSummary,
} from "./production.types";

export function calculateProductionSummary(
  batches: ProductionBatch[],
): ProductionSummary {
  return batches.reduce<ProductionSummary>(
    (summary, batch) => {
      summary.totalBatches += 1;
      summary.totalProduced += batch.producedQuantity;
      summary.totalDamaged += batch.damagedQuantity;

      if (
        batch.status === "planned" ||
        batch.status === "in_progress"
      ) {
        summary.activeBatches += 1;
      }

      if (batch.status === "completed") {
        summary.completedBatches += 1;
      }

      return summary;
    },
    {
      totalBatches: 0,
      totalProduced: 0,
      totalDamaged: 0,
      activeBatches: 0,
      completedBatches: 0,
    },
  );
}

export function filterProductionBatches(
  batches: ProductionBatch[],
  filters: ProductionFiltersState,
): ProductionBatch[] {
  const search = filters.search.trim().toLowerCase();

  return batches.filter((batch) => {
    const matchesSearch =
      !search ||
      batch.batchNumber.toLowerCase().includes(search) ||
      batch.brickGrade.toLowerCase().includes(search);

    const matchesStage =
      filters.stage === "all" ||
      batch.stage === filters.stage;

    const matchesStatus =
      filters.status === "all" ||
      batch.status === filters.status;

    const matchesStart =
      !filters.startDate ||
      batch.startDate >= filters.startDate;

    const matchesEnd =
      !filters.endDate ||
      batch.startDate <= filters.endDate;

    return (
      matchesSearch &&
      matchesStage &&
      matchesStatus &&
      matchesStart &&
      matchesEnd
    );
  });
}

export function calculateGoodBricks(
  produced: number,
  damaged: number,
): number {
  return Math.max(0, produced - damaged);
}

export function calculateDamagePercentage(
  produced: number,
  damaged: number,
): number {
  if (produced <= 0) return 0;

  return Math.min(100, (damaged / produced) * 100);
}

export function formatBrickQuantity(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatProductionDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
