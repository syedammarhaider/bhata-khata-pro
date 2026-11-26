// ============================================================
// FILE 137
// PATH: E:\BRICKSCS\src\features\production\components\ProductionExport.tsx
// ============================================================

import { Download } from "lucide-react";
import type { ProductionBatch } from "../production.types";

interface ProductionExportProps {
  batches: ProductionBatch[];
  filename?: string;
}

function escapeCsv(value: string | number | undefined): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function ProductionExport({
  batches,
  filename = "production-report",
}: ProductionExportProps) {
  function exportCsv() {
    const headers = [
      "Batch Number",
      "Brick Grade",
      "Planned Quantity",
      "Produced Quantity",
      "Damaged Quantity",
      "Stage",
      "Status",
      "Start Date",
      "Expected Date",
      "Completed Date",
      "Notes",
    ];

    const rows = batches.map((batch) => [
      batch.batchNumber,
      batch.brickGrade,
      batch.quantity,
      batch.producedQuantity,
      batch.damagedQuantity,
      batch.stage,
      batch.status,
      batch.startDate,
      batch.expectedDate,
      batch.completedDate,
      batch.notes,
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csv],
      { type: "text/csv;charset=utf-8;" },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${filename}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      disabled={batches.length === 0}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      <Download size={16} />
      Export CSV
    </button>
  );
}
