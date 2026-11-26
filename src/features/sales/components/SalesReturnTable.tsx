// ============================================================
// FILE 189
// PATH: E:\BRICKSCS\src\features\sales\components\SalesReturnTable.tsx
// ============================================================

import type { SalesReturnRecord } from "../sales.types";
import SalesReturnBadge from "./SalesReturnBadge";

export default function SalesReturnTable({ returns }: { returns: SalesReturnRecord[] }) {
  if (!returns.length) {
    return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500 dark:border-slate-700">No sales returns recorded.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border dark:border-slate-800">
      <table className="w-full min-w-[750px] text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr><th className="p-3">Date</th><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3">Grade</th><th className="p-3">Quantity</th><th className="p-3">Credit (PKR)</th><th className="p-3">Reason</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          {returns.map((item) => (
            <tr key={item.id}>
              <td className="p-3">{item.date}</td><td className="p-3">{item.invoiceNumber}</td><td className="p-3">{item.customerName}</td><td className="p-3">{item.brickGrade}</td><td className="p-3">{item.quantity.toLocaleString("en-PK")}</td><td className="p-3">{item.creditAmount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}</td><td className="p-3">{item.reason}</td><td className="p-3"><SalesReturnBadge status={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
