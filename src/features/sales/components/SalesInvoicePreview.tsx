// ============================================================
// FILE 177
// PATH: E:\BRICKSCS\src\features\sales\components\SalesInvoicePreview.tsx
// ============================================================

import type { SaleRecord } from "../sales.types";
import SalesInvoiceHeader from "./SalesInvoiceHeader";
import SalesItemsTable from "./SalesItemsTable";
import SalesInvoiceTotals from "./SalesInvoiceTotals";

interface SalesInvoicePreviewProps {
  sale: SaleRecord;
}

export default function SalesInvoicePreview({ sale }: SalesInvoicePreviewProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-5 bg-white p-6 text-slate-900 dark:bg-white">
      <SalesInvoiceHeader sale={sale} />
      <div className="border-t border-slate-200 pt-4">
        <p className="text-sm font-medium">Customer: {sale.customerName}</p>
        {sale.customerPhone && <p className="mt-1 text-sm">Phone: {sale.customerPhone}</p>}
        <p className="mt-1 text-sm">Invoice date: {sale.saleDate}</p>
      </div>
      <SalesItemsTable items={sale.items} onRemove={() => undefined} />
      <SalesInvoiceTotals sale={sale} />
      {sale.notes && <p className="text-sm">Notes: {sale.notes}</p>}
    </article>
  );
}
