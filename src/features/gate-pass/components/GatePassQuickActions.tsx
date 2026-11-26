// ============================================================
// FILE 251
// PATH: src/features/gate-pass/components/GatePassQuickActions.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassQuickActions({
  pass,
  onPrint,
  onApprove,
  onDispatch,
}: {
  pass: GatePass;
  onPrint: () => void;
  onApprove: () => void;
  onDispatch: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={onPrint}>Print</button>
      <button disabled={pass.status !== "prepared"} onClick={onApprove}>
        Approve
      </button>
      <button disabled={pass.status !== "approved"} onClick={onDispatch}>
        Mark dispatched
      </button>
    </div>
  );
}
