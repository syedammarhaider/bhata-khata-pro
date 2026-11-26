// ============================================================
// FILE 182
// PATH: E:\BRICKSCS\src\features\sales\components\SalesDetails.tsx
// ============================================================

import type { SaleRecord } from "../sales.types";
import SalesStatusBadge from "./SalesStatusBadge";
import SalesPaymentBadge from "./SalesPaymentBadge";
import SalesInvoiceTotals from "./SalesInvoiceTotals";

export default function SalesDetails({ sale }: { sale: SaleRecord }) {
  return (
    <div className="space-y-5 rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h3 className="font-semibold">{sale.invoiceNumber}</h3>
          <p className="mt-1 text-sm text-slate-500">{sale.customerName}</p>
        </div>
        <div className="flex gap-2">
          <SalesStatusBadge status={sale.status} />
          <SalesPaymentBadge status={sale.paymentStatus} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-xs text-slate-500">Sale date</p><p className="mt-1 font-medium">{sale.saleDate}</p></div>
        <div><p className="text-xs text-slate-500">Items</p><p className="mt-1 font-medium">{sale.items.length}</p></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b"><th className="py-2">Grade</th><th className="py-2">Qty</th><th className="py-2">Rate</th><th className="py-2">Total</th></tr></thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b dark:border-slate-800">
                <td className="py-2">{item.brickGrade}</td><td className="py-2">{item.quantity.toLocaleString("en-PK")}</td><td className="py-2">{item.unitPrice.toLocaleString("en-PK")}</td><td className="py-2">{(item.quantity * item.unitPrice).toLocaleString("en-PK")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SalesInvoiceTotals sale={sale} />
    </div>
  );
}
