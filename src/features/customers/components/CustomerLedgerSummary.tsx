// ============================================================
// FILE 333
// PATH: src/features/customers/components/CustomerLedgerSummary.tsx
// ============================================================

import type { CustomerLedgerEntry } from "../customers.types";

export default function CustomerLedgerSummary({
  entries,
  openingBalance = 0,
}: {
  entries: CustomerLedgerEntry[];
  openingBalance?: number;
}) {
  const debit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const credit = entries.reduce((sum, entry) => sum + entry.credit, 0);
  const balance = openingBalance + debit - credit;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Summary label="Total Debit" value={debit} />
      <Summary label="Total Credit" value={credit} />
      <Summary label="Closing Balance" value={balance} />
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 dark:border-slate-800">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">PKR {value.toLocaleString()}</p>
    </div>
  );
}
