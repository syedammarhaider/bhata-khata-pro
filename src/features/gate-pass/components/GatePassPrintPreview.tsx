// ============================================================
// FILE 274
// PATH: src/features/gate-pass/components/GatePassPrintPreview.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassPrintPreview({ item }: { item: GatePass }) {
  return (
    <article className="bg-white p-6 text-black print:p-0">
      <h1 className="text-2xl font-bold">GATE PASS</h1>
      <p className="font-semibold">{item.passNumber}</p>
      <hr className="my-3" />
      <p>Customer: {item.customerName}</p>
      <p>Date: {item.dispatchDate}</p>
      <p>Vehicle: {item.vehicleNumber}</p>
      <p>
        Driver: {item.driverName} — {item.driverPhone}
      </p>
      <p>Destination: {item.destination}</p>
      <p>
        Bricks: {item.quantity.toLocaleString()} {item.unit} · Grade{" "}
        {item.brickGrade}
      </p>
      <hr className="my-6" />
      <div className="flex justify-between">
        <span>Prepared by: __________</span>
        <span>Authorized by: __________</span>
      </div>
    </article>
  );
}
