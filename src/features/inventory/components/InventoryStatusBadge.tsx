// ============================================================
// FILE 290
// PATH: src/features/inventory/components/InventoryStatusBadge.tsx
// ============================================================

import type { StockStatus } from "../inventory.types";

const styles: Record<StockStatus, string> = {
  "in-stock": "bg-emerald-100 text-emerald-700",
  "low-stock": "bg-amber-100 text-amber-700",
  "out-of-stock": "bg-rose-100 text-rose-700",
};

const labels: Record<StockStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

export default function InventoryStatusBadge({
  status,
}: {
  status: StockStatus;
}) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
