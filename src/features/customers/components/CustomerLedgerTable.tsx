// ============================================================
// FILE 332
// PATH: src/features/customers/components/CustomerLedgerTable.tsx
// ============================================================

import type { CustomerLedgerEntry } from "../customers.types";

export default function CustomerLedgerTable({
  entries,
}: {
  entries: CustomerLedgerEntry[];
}) {
  if (!entries.length) {
    return <p className="py-8 text-center text-sm text-slate-500">No ledger entries found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Reference</th>
            <th className="p-3">Description</th>
            <th className="p-3">Debit</th>
            <th className="p-3">Credit</th>
            <th className="p-3">Balance</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-800">
              <td className="p-3">{new Date(entry.date).toLocaleDateString()}</td>
              <td className="p-3">{entry.reference}</td>
              <td className="p-3">{entry.description}</td>
              <td className="p-3">{entry.debit.toLocaleString()}</td>
              <td className="p-3">{entry.credit.toLocaleString()}</td>
              <td className="p-3 font-medium">{entry.balance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
