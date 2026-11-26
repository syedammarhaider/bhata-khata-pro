// ============================================================
// FILE 263
// PATH: src/features/gate-pass/components/GatePassVehicleSummary.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassVehicleSummary({ item }: { item: GatePass }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-slate-500">Vehicle and driver</p>
      <p className="font-semibold">{item.vehicleNumber}</p>
      <p>{item.driverName}</p>
      <p className="text-sm text-slate-500">
        {item.driverPhone || "No phone provided"}
      </p>
    </div>
  );
}
