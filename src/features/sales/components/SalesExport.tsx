// ============================================================
// FILE 186
// PATH: E:\BRICKSCS\src\features\sales\components\SalesExport.tsx
// ============================================================

import { Download } from "lucide-react";
import type { SaleRecord } from "../sales.types";

interface SalesExportProps {
  sales: SaleRecord[];
  filename?: string;
}

function cell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export default function SalesExport({ sales, filename = "sales-report" }: SalesExportProps) {
  function download() {
    const headers = ["Invoice", "Customer", "Phone", "Date", "Subtotal", "Discount", "Tax", "Grand Total", "Received", "Due", "Payment Status", "Sale Status"];
    const rows = sales.map((sale) => [
      sale.invoiceNumber, sale.customerName, sale.customerPhone ?? "", sale.saleDate,
      sale.subtotal, sale.discount, sale.tax, sale.grandTotal, sale.paidAmount,
      sale.dueAmount, sale.paymentStatus, sale.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
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
    <button type="button" onClick={download} disabled={!sales.length} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm disabled:opacity-50 dark:border-slate-700">
      <Download size={16} /> Export sales CSV
    </button>
  );
}
