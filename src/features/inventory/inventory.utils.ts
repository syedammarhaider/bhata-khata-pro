// ============================================================
// FILE 281
// PATH: src/features/inventory/inventory.utils.ts
// ============================================================

import type {
  InventoryItem,
  InventorySummary,
  StockMovement,
  StockStatus,
} from "./inventory.types";

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.quantity <= 0) return "out-of-stock";
  if (item.quantity <= item.reorderLevel) return "low-stock";
  return "in-stock";
}

export function getAvailableStock(item: InventoryItem): number {
  return Math.max(0, item.quantity - item.reservedQuantity);
}

export function calculateInventorySummary(
  items: InventoryItem[],
): InventorySummary {
  return {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: items.filter(
      (item) => getStockStatus(item) === "low-stock",
    ).length,
    outOfStockItems: items.filter(
      (item) => getStockStatus(item) === "out-of-stock",
    ).length,
    damagedQuantity: items.reduce(
      (sum, item) => sum + item.damagedQuantity,
      0,
    ),
  };
}

export function filterInventory(
  items: InventoryItem[],
  search: string,
  status: StockStatus | "all",
): InventoryItem[] {
  const query = search.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      !query ||
      item.gradeName.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);

    const matchesStatus =
      status === "all" || getStockStatus(item) === status;

    return matchesSearch && matchesStatus;
  });
}

export function calculateMovementBalance(
  movements: StockMovement[],
): number {
  return movements.reduce((balance, movement) => {
    if (movement.type === "in" || movement.type === "return") {
      return balance + movement.quantity;
    }

    if (
      movement.type === "out" ||
      movement.type === "damage"
    ) {
      return balance - movement.quantity;
    }

    return balance + movement.quantity;
  }, 0);
}
