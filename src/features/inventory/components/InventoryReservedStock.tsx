// ============================================================
// FILE 308
// PATH: src/features/inventory/components/InventoryReservedStock.tsx
import { LocalizedText } from "../../../lib/i18n";
// ============================================================

import type { InventoryItem } from "../inventory.types";

export default function InventoryReservedStock({
  item,
}: {
  item: InventoryItem;
}) {
  const available = Math.max(0, item.quantity - item.reservedQuantity);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
        <p className="text-xs text-slate-500"><LocalizedText text="Reserved" /></p>
        <p className="mt-1 font-semibold">{item.reservedQuantity.toLocaleString()}</p>
      </div>
      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
        <p className="text-xs text-slate-500"><LocalizedText text="Available" /></p>
        <p className="mt-1 font-semibold">{available.toLocaleString()}</p>
      </div>
    </div>
  );
}
