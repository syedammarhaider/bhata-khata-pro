// ============================================================
// FILE 179
// PATH: E:\BRICKSCS\src\features\sales\components\SalesInvoiceTotals.tsx
// ============================================================

import type { SaleRecord } from "../sales.types";
import { formatSalesAmount } from "../sales.utils";

export default function SalesInvoiceTotals({ sale }: { sale: SaleRecord }) {
  const rows = [
    ["Subtotal", sale.subtotal],
    ["Discount", -sale.discount],
    ["Tax", sale.tax],
    ["Grand total", sale.grandTotal],
    ["Received", sale.paidAmount],
    ["Balance due", sale.dueAmount],
  ] as const;

  return (
    <div className="ml-auto max-w-sm space-y-2 border-t border-slate-200 pt-4">
      {rows.map(([label, value]) => (
        <div key={label} className={`flex justify-between gap-4 text-sm ${label === "Grand total" || label === "Balance due" ? "font-bold" : ""}`}>
          <span>{label}</span>
          <span>PKR {formatSalesAmount(value)}</span>
        </div>
      ))}
    </div>
  );
}
