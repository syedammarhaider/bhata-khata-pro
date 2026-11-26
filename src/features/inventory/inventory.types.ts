// ============================================================
// FILE 279
// PATH: src/features/inventory/inventory.types.ts
// ============================================================

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type StockMovementType = "in" | "out" | "adjustment" | "damage" | "return";

export interface InventoryItem {
  id: string;
  gradeId: string;
  gradeName: string;
  quantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  reorderLevel: number;
  unit: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  gradeName: string;
  type: StockMovementType;
  quantity: number;
  reference: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface StockAdjustment {
  itemId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface InventoryFilters {
  search: string;
  status: StockStatus | "all";
  gradeId: string;
}

export interface InventorySummary {
  totalItems: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
  damagedQuantity: number;
}

export interface StockMovementInput {
  itemId: string;
  type: StockMovementType;
  quantity: number;
  reference: string;
  notes?: string;
}
