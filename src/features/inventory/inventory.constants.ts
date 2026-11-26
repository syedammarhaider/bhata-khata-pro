// ============================================================
// FILE 280
// PATH: src/features/inventory/inventory.constants.ts
// ============================================================

import type { StockMovementType, StockStatus } from "./inventory.types";

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

export const MOVEMENT_LABELS: Record<StockMovementType, string> = {
  in: "Stock In",
  out: "Stock Out",
  adjustment: "Adjustment",
  damage: "Damaged Stock",
  return: "Return",
};

export const DEFAULT_REORDER_LEVEL = 500;
export const INVENTORY_PAGE_SIZE = 10;

export const MOVEMENT_OPTIONS = [
  { value: "in", label: "Stock In" },
  { value: "out", label: "Stock Out" },
  { value: "adjustment", label: "Adjustment" },
  { value: "damage", label: "Damaged Stock" },
  { value: "return", label: "Return" },
];
