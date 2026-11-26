// ============================================================
// FILE 265
// PATH: src/features/gate-pass/components/GatePassProductSummary.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassProductSummary({ item }: { item: GatePass }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-slate-500">Dispatch quantity</p>
      <p className="text-xl font-semibold">
        {item.quantity.toLocaleString()}
      </p>
      <p>
        {item.brickGrade} · {item.unit}
      </p>
    </div>
  );
}
