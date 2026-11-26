// ============================================================
// FILE 282
// PATH: src/features/inventory/inventory.service.ts
// ============================================================

import type {
  InventoryItem,
  StockAdjustment,
  StockMovementInput,
} from "./inventory.types";

export function prepareStockAdjustment(
  adjustment: StockAdjustment,
): StockAdjustment {
  if (!adjustment.itemId.trim()) {
    throw new Error("Select an inventory item.");
  }

  if (!Number.isFinite(adjustment.quantity) || adjustment.quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  if (!adjustment.reason.trim()) {
    throw new Error("Adjustment reason is required.");
  }

  return {
    ...adjustment,
    reason: adjustment.reason.trim(),
    notes: adjustment.notes?.trim() || undefined,
  };
}

export function prepareStockMovement(
  movement: StockMovementInput,
): StockMovementInput {
  if (!movement.itemId.trim()) {
    throw new Error("Inventory item is required.");
  }

  if (!Number.isFinite(movement.quantity) || movement.quantity <= 0) {
    throw new Error("Enter a valid quantity.");
  }

  if (!movement.reference.trim()) {
    throw new Error("Reference is required.");
  }

  return {
    ...movement,
    reference: movement.reference.trim(),
    notes: movement.notes?.trim() || undefined,
  };
}

export function applyMovementLocally(
  item: InventoryItem,
  movement: StockMovementInput,
): InventoryItem {
  if (item.id !== movement.itemId) {
    throw new Error("The selected inventory item does not match.");
  }

  let quantity = item.quantity;
  let damagedQuantity = item.damagedQuantity;

  switch (movement.type) {
    case "in":
    case "return":
      quantity += movement.quantity;
      break;

    case "out":
      if (movement.quantity > item.quantity) {
        throw new Error("Insufficient stock.");
      }
      quantity -= movement.quantity;
      break;

    case "damage":
      if (movement.quantity > item.quantity) {
        throw new Error("Damaged quantity exceeds available stock.");
      }
      quantity -= movement.quantity;
      damagedQuantity += movement.quantity;
      break;

    case "adjustment":
      quantity += movement.quantity;
      break;
  }

  return {
    ...item,
    quantity,
    damagedQuantity,
    updatedAt: new Date().toISOString(),
  };
}
