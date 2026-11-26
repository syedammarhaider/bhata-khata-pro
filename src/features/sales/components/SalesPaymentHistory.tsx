// ============================================================
// FILE 181
// PATH: E:\BRICKSCS\src\features\sales\components\SalesPaymentHistory.tsx
// ============================================================

import type { SalesPaymentRecord } from "../sales.types";

interface SalesPaymentHistoryProps {
  payments: SalesPaymentRecord[];
}

export default function SalesPaymentHistory({ payments }: SalesPaymentHistoryProps) {
  if (!payments.length) {
    return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500 dark:border-slate-700">No payments recorded yet.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border dark:border-slate-800">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr><th className="p-3">Date</th><th className="p-3">Invoice ID</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Reference</th></tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="p-3">{payment.date}</td>
              <td className="p-3">{payment.saleId}</td>
              <td className="p-3 font-semibold">PKR {payment.amount.toLocaleString("en-PK")}</td>
              <td className="p-3 capitalize">{payment.method}</td>
              <td className="p-3">{payment.reference || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
