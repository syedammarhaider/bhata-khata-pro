// ============================================================
// FILE 268
// PATH: src/features/gate-pass/components/GatePassDispatchAction.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassDispatchAction({
  item,
  onDispatch,
}: {
  item: GatePass;
  onDispatch: () => void;
}) {
  return (
    <button
      disabled={item.status !== "approved"}
      onClick={onDispatch}
      className="btn-primary disabled:opacity-40"
    >
      Confirm dispatch
    </button>
  );
}
