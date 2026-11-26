// ============================================================
// FILE 355
// PATH: src/features/customers/components/CustomerLedgerEmptyState.tsx
// ============================================================

export default function CustomerLedgerEmptyState() {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center dark:border-slate-700">
      <h3 className="font-semibold">No ledger activity</h3>
      <p className="mt-1 text-sm text-slate-500">
        Customer sales, payments, returns, and adjustments will appear here.
      </p>
    </div>
  );
}
