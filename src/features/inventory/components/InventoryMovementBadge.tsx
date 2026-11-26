// ============================================================
// FILE 313
// PATH: src/features/inventory/components/InventoryMovementBadge.tsx
// ============================================================

import type { StockMovementType } from "../inventory.types";
import { MOVEMENT_LABELS } from "../inventory.constants";

const colors: Record<StockMovementType, string> = {
  in: "bg-emerald-100 text-emerald-700",
  out: "bg-rose-100 text-rose-700",
  adjustment: "bg-indigo-100 text-indigo-700",
  damage: "bg-amber-100 text-amber-700",
  return: "bg-sky-100 text-sky-700",
};

export default function InventoryMovementBadge({
  type,
}: {
  type: StockMovementType;
}) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[type]}`}>
      {MOVEMENT_LABELS[type]}
    </span>
  );
}
