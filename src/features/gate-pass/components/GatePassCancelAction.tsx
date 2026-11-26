// ============================================================
// FILE 270
// PATH: src/features/gate-pass/components/GatePassCancelAction.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassCancelAction({
  item,
  onCancel,
}: {
  item: GatePass;
  onCancel: () => void;
}) {
  return (
    <button
      disabled={["delivered", "cancelled"].includes(item.status)}
      onClick={onCancel}
      className="text-red-600 disabled:opacity-40"
    >
      Cancel pass
    </button>
  );
}
