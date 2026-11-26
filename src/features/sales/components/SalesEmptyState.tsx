// ============================================================
// FILE 185
// PATH: E:\BRICKSCS\src\features\sales\components\SalesEmptyState.tsx
// ============================================================

import { ReceiptText, Plus } from "lucide-react";

interface SalesEmptyStateProps {
  hasRecords: boolean;
  onCreate: () => void;
}

export default function SalesEmptyState({ hasRecords, onCreate }: SalesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
        <ReceiptText size={27} />
      </div>
      <h3 className="text-lg font-semibold">{hasRecords ? "No matching sales" : "No sales recorded yet"}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {hasRecords ? "Change the filters to see other sales." : "Create your first brick sale to start recording invoices and customer balances."}
      </p>
      {!hasRecords && (
        <button type="button" onClick={onCreate} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm text-white">
          <Plus size={16} /> Create sale
        </button>
      )}
    </div>
  );
}
