// ============================================================
// FILE 222
// PATH: src/features/orders/components/OrderCancelDialog.tsx
// ============================================================

export function OrderCancelDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5">
        <h3 className="font-semibold">Cancel this order?</h3>
        <p className="my-3 text-sm">
          Cancellation should be recorded in the audit history.
        </p>
        <button onClick={onCancel}>Keep order</button>
        <button onClick={onConfirm} className="ml-4 text-red-600">
          Confirm cancellation
        </button>
      </div>
    </div>
  );
}
