// ============================================================
// FILE 269
// PATH: src/features/gate-pass/components/GatePassDeliveryAction.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassDeliveryAction({
  item,
  onDeliver,
}: {
  item: GatePass;
  onDeliver: () => void;
}) {
  return (
    <button
      disabled={item.status !== "dispatched"}
      onClick={onDeliver}
      className="btn-primary disabled:opacity-40"
    >
      Mark delivered
    </button>
  );
}
