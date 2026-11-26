// ============================================================
// FILE 266
// PATH: src/features/gate-pass/components/GatePassTimeline.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

const steps = ["prepared", "approved", "dispatched", "delivered"];

export function GatePassTimeline({ item }: { item: GatePass }) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((s, i) => (
        <li
          key={s}
          className={`rounded-lg px-3 py-2 text-xs ${
            steps.indexOf(item.status) >= i
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {i + 1}. {s}
        </li>
      ))}
    </ol>
  );
}
