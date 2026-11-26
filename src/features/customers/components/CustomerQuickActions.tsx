// ============================================================
// FILE 343
// PATH: src/features/customers/components/CustomerQuickActions.tsx
// ============================================================

interface Props {
  onAddPayment?: () => void;
  onViewLedger?: () => void;
  onEdit?: () => void;
}

export default function CustomerQuickActions({
  onAddPayment,
  onViewLedger,
  onEdit,
}: Props) {
  const actions = [
    ["Add Payment", onAddPayment],
    ["View Ledger", onViewLedger],
    ["Edit Customer", onEdit],
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([label, callback]) => (
        <button
          key={label}
          type="button"
          disabled={!callback}
          onClick={callback}
          className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50 dark:border-slate-700"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
