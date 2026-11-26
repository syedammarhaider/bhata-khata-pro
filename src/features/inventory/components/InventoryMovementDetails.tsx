// ============================================================
// FILE 314
// PATH: src/features/inventory/components/InventoryMovementDetails.tsx
// ============================================================

import type { StockMovement } from "../inventory.types";
import { MOVEMENT_LABELS } from "../inventory.constants";

export default function InventoryMovementDetails({
  movement,
}: {
  movement: StockMovement;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <p><span className="text-slate-500">Grade:</span> {movement.gradeName}</p>
      <p><span className="text-slate-500">Type:</span> {MOVEMENT_LABELS[movement.type]}</p>
      <p><span className="text-slate-500">Quantity:</span> {movement.quantity.toLocaleString()}</p>
      <p><span className="text-slate-500">Reference:</span> {movement.reference}</p>
      <p><span className="text-slate-500">Created by:</span> {movement.createdBy}</p>
      <p><span className="text-slate-500">Date:</span> {new Date(movement.createdAt).toLocaleString()}</p>
      {movement.notes && (
        <p className="sm:col-span-2"><span className="text-slate-500">Notes:</span> {movement.notes}</p>
      )}
    </div>
  );
}
