// ============================================================
// FILE 273
// PATH: src/features/gate-pass/components/GatePassConfirmDialog.tsx
// ============================================================

export function GatePassConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 dark:bg-slate-900">
        <h3 className="font-semibold">{title}</h3>
        <p className="my-3 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm} className="text-red-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
