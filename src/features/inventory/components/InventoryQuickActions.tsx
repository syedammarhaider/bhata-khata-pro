// ============================================================
// FILE 302
// PATH: src/features/inventory/components/InventoryQuickActions.tsx
// ============================================================

interface Props {
  onStockIn?: () => void;
  onStockOut?: () => void;
  onAdjustment?: () => void;
}

export default function InventoryQuickActions({
  onStockIn,
  onStockOut,
  onAdjustment,
}: Props) {
  const actions = [
    { label: "Stock In", callback: onStockIn },
    { label: "Stock Out", callback: onStockOut },
    { label: "Adjustment", callback: onAdjustment },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.callback}
          disabled={!action.callback}
          className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50 dark:border-slate-700"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
