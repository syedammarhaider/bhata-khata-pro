// ============================================================
// FILE 298
// PATH: src/features/inventory/components/InventoryDamageSummary.tsx
// ============================================================

import type { InventoryItem } from "../inventory.types";

export default function InventoryDamageSummary({
  items,
}: {
  items: InventoryItem[];
}) {
  const damaged = items.reduce((sum, item) => sum + item.damagedQuantity, 0);

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
      <p className="text-sm text-rose-700 dark:text-rose-300">Total Damaged Bricks</p>
      <p className="mt-2 text-2xl font-semibold text-rose-800 dark:text-rose-200">
        {damaged.toLocaleString()}
      </p>
    </div>
  );
}
