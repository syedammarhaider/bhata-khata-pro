// ============================================================
// FILE 271
// PATH: src/features/gate-pass/components/GatePassDateSummary.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassDateSummary({ item }: { item: GatePass }) {
  return (
    <div className="text-sm">
      <p>
        <span className="text-slate-500">Dispatch date:</span>{" "}
        {item.dispatchDate}
      </p>
      <p>
        <span className="text-slate-500">Created:</span>{" "}
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
