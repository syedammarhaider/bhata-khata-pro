// ============================================================
// FILE 248
// PATH: src/features/gate-pass/components/GatePassStatusBadge.tsx
// ============================================================

import type { GatePassStatus } from "../gatePass.types";
import { GATE_PASS_STATUS_LABELS } from "../gatePass.constants";

const classes: Record<GatePassStatus, string> = {
  prepared: "bg-slate-100 text-slate-700",
  approved: "bg-blue-100 text-blue-800",
  dispatched: "bg-amber-100 text-amber-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function GatePassStatusBadge({ status }: { status: GatePassStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs ${classes[status]}`}>
      {GATE_PASS_STATUS_LABELS[status]}
    </span>
  );
}
