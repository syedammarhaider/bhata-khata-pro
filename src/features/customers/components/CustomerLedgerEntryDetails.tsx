// ============================================================
// FILE 342
// PATH: src/features/customers/components/CustomerLedgerEntryDetails.tsx
// ============================================================

import type { CustomerLedgerEntry } from "../customers.types";

export default function CustomerLedgerEntryDetails({
  entry,
}: {
  entry: CustomerLedgerEntry;
}) {
  return (
    <div className="space-y-2 text-sm">
      <p><strong>Reference:</strong> {entry.reference}</p>
      <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
      <p><strong>Description:</strong> {entry.description}</p>
      <p><strong>Debit:</strong> PKR {entry.debit.toLocaleString()}</p>
      <p><strong>Credit:</strong> PKR {entry.credit.toLocaleString()}</p>
      <p><strong>Running Balance:</strong> PKR {entry.balance.toLocaleString()}</p>
    </div>
  );
}
