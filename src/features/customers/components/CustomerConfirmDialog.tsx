// ============================================================
// FILE 347
// PATH: src/features/customers/components/CustomerConfirmDialog.tsx
// ============================================================

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CustomerConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
