// ============================================================
// FILE 221
// PATH: src/features/orders/components/OrderConfirmDialog.tsx
// ============================================================

export function OrderConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 dark:bg-slate-900">
        <h3 className="font-semibold">{title}</h3>
        <p className="my-3 text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel}>Back</button>
          <button onClick={onConfirm} className="text-red-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
