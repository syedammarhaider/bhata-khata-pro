// ============================================================
// FILE 317
// PATH: src/features/inventory/components/InventoryLowStockList.tsx
import { LocalizedText } from "../../../lib/i18n";
// ============================================================

import type { InventoryItem } from "../inventory.types";

export default function InventoryLowStockList({
  items,
}: {
  items: InventoryItem[];
}) {
  const low = items.filter(
    (item) => item.quantity > 0 && item.quantity <= item.reorderLevel,
  );

  return (
    <div className="space-y-2">
      {low.length === 0 ? (
        <p className="text-sm text-slate-500"><LocalizedText text="No low-stock items." /></p>
      ) : (
        low.map((item) => (
          <div key={item.id} className="flex justify-between rounded-lg border p-3 dark:border-slate-800">
            <span className="font-medium">{item.gradeName}</span>
            <span className="text-amber-600">{item.quantity.toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
}
