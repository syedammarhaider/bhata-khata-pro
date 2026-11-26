// ============================================================
// FILE 254
// PATH: src/features/gate-pass/components/GatePassDetailsModal.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassDetailsModal({
  item,
  onClose,
}: {
  item: GatePass | null;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 dark:bg-slate-900">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">{item.passNumber}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {Object.entries(item)
            .filter(([k]) => !["id", "createdAt"].includes(k))
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-slate-500 capitalize">{k}</dt>
                <dd className="font-medium">{String(v ?? "—")}</dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );
}
