// ============================================================
// FILE 295
// PATH: src/features/inventory/components/InventoryItemDetails.tsx
// ============================================================

import type { InventoryItem } from "../inventory.types";
import { getAvailableStock, getStockStatus } from "../inventory.utils";
import { STOCK_STATUS_LABELS } from "../inventory.constants";
import { LocalizedText } from "../../../lib/i18n";

export default function InventoryItemDetails({
  item,
}: {
  item: InventoryItem;
}) {
  const details = [
    ["Brick Grade", item.gradeName],
    ["Total Quantity", item.quantity.toLocaleString()],
    ["Reserved Quantity", item.reservedQuantity.toLocaleString()],
    ["Available Quantity", getAvailableStock(item).toLocaleString()],
    ["Damaged Quantity", item.damagedQuantity.toLocaleString()],
    ["Reorder Level", item.reorderLevel.toLocaleString()],
    ["Status", STOCK_STATUS_LABELS[getStockStatus(item)]],
    ["Last Updated", new Date(item.updatedAt).toLocaleString()],
  ];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {details.map(([label, value]) => (
        <div key={label} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <dt className="text-xs text-slate-500"><LocalizedText text={label} /></dt>
          <dd className="mt-1 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
