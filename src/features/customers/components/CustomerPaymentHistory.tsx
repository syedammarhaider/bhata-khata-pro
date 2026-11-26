// ============================================================
// FILE 335
// PATH: src/features/customers/components/CustomerPaymentHistory.tsx
// ============================================================

import type { CustomerLedgerEntry } from "../customers.types";

export default function CustomerPaymentHistory({
  entries,
}: {
  entries: CustomerLedgerEntry[];
}) {
  const payments = entries.filter((entry) => entry.type === "payment");

  if (!payments.length) {
    return <p className="text-sm text-slate-500">No payments recorded.</p>;
  }

  return (
    <div className="space-y-2">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3 dark:border-slate-800">
          <div>
            <p className="font-medium">{payment.reference}</p>
            <p className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString()}</p>
          </div>
          <p className="font-semibold text-emerald-700">
            PKR {payment.credit.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
