// ============================================================
// FILE 267
// PATH: src/features/gate-pass/components/GatePassApproval.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassApproval({
  item,
  onApprove,
}: {
  item: GatePass;
  onApprove: () => void;
}) {
  return (
    <button
      disabled={item.status !== "prepared"}
      onClick={onApprove}
      className="btn-primary disabled:opacity-40"
    >
      Approve gate pass
    </button>
  );
}
