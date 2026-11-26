// ============================================================
// FILE 297
// PATH: src/features/inventory/components/InventoryReorderAlert.tsx
// ============================================================

import { AlertTriangle } from "lucide-react";
import type { InventoryItem } from "../inventory.types";

export default function InventoryReorderAlert({
  items,
}: {
  items: InventoryItem[];
}) {
  const lowItems = items.filter(
    (item) => item.quantity > 0 && item.quantity <= item.reorderLevel,
  );

  if (!lowItems.length) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
      <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
        <AlertTriangle size={18} />
        Stock Reorder Required
      </div>
      <ul className="mt-2 list-inside list-disc text-sm text-amber-800 dark:text-amber-200">
        {lowItems.map((item) => (
          <li key={item.id}>{item.gradeName}: {item.quantity.toLocaleString()} remaining</li>
        ))}
      </ul>
    </div>
  );
}
