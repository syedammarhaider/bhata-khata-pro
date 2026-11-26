// ============================================================
// FILE 299
// PATH: src/features/inventory/components/InventoryExportButton.tsx
// ============================================================

import type { InventoryItem } from "../inventory.types";

export default function InventoryExportButton({
  items,
}: {
  items: InventoryItem[];
}) {
  function exportCsv() {
    const rows = [
      ["Grade", "Quantity", "Reserved", "Damaged", "Reorder Level"],
      ...items.map((item) => [
        item.gradeName,
        String(item.quantity),
        String(item.reservedQuantity),
        String(item.damagedQuantity),
        String(item.reorderLevel),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inventory.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700"
    >
      Export CSV
    </button>
  );
}
