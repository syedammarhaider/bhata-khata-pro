// ============================================================
// FILE 316
// PATH: src/features/inventory/components/InventoryMovementSummary.tsx
// ============================================================

import type { StockMovement } from "../inventory.types";

export default function InventoryMovementSummary({
  movements,
}: {
  movements: StockMovement[];
}) {
  const incoming = movements
    .filter((item) => item.type === "in" || item.type === "return")
    .reduce((sum, item) => sum + item.quantity, 0);

  const outgoing = movements
    .filter((item) => item.type === "out" || item.type === "damage")
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
        <p className="text-sm text-emerald-700">Incoming</p>
        <p className="mt-1 text-xl font-semibold text-emerald-800">{incoming.toLocaleString()}</p>
      </div>
      <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/20">
        <p className="text-sm text-rose-700">Outgoing</p>
        <p className="mt-1 text-xl font-semibold text-rose-800">{outgoing.toLocaleString()}</p>
      </div>
    </div>
  );
}
