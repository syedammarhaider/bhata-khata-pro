// ============================================================
// FILE 315
// PATH: src/features/inventory/components/InventoryMovementFilters.tsx
// ============================================================

import type { StockMovementType } from "../inventory.types";
import { MOVEMENT_OPTIONS } from "../inventory.constants";

interface Props {
  value: StockMovementType | "all";
  onChange: (value: StockMovementType | "all") => void;
}

export default function InventoryMovementFilters({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as StockMovementType | "all")}
      className="rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <option value="all">All Movements</option>
      {MOVEMENT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
