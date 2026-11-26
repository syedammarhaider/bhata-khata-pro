// ============================================================
// FILE 264
// PATH: src/features/gate-pass/components/GatePassCustomerSummary.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassCustomerSummary({ item }: { item: GatePass }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-slate-500">Customer</p>
      <p className="font-semibold">{item.customerName}</p>
      <p className="text-sm">{item.destination}</p>
    </div>
  );
}
