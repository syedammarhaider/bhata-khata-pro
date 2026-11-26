// ============================================================
// FILE 278
// PATH: src/features/gate-pass/components/GatePassDeliveryStatus.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassDeliveryStatus({ item }: { item: GatePass }) {
  const delivered = item.status === "delivered";
  return (
    <div
      className={`rounded-lg p-3 text-sm ${
        delivered
          ? "bg-green-50 text-green-800"
          : "bg-amber-50 text-amber-800"
      }`}
    >
      <p className="font-semibold">
        {delivered ? "Delivery completed" : "Delivery not yet completed"}
      </p>
      <p>
        {item.status === "dispatched"
          ? "Shipment has left the kiln."
          : item.status === "delivered"
            ? "Shipment marked as delivered."
            : `Current status: ${item.status}.`}
      </p>
    </div>
  );
}
