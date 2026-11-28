// ============================================================
// FILE 314
// PATH: src/features/inventory/components/InventoryMovementDetails.tsx
// ============================================================

import type { StockMovement } from "../inventory.types";
import { MOVEMENT_LABELS } from "../inventory.constants";
import { LocalizedText } from "../../../lib/i18n";

export default function InventoryMovementDetails({
  movement,
}: {
  movement: StockMovement;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <p><span className="text-slate-500"><LocalizedText text="Grade:" /></span> {movement.gradeName}</p>
      <p><span className="text-slate-500"><LocalizedText text="Type:" /></span> <LocalizedText text={MOVEMENT_LABELS[movement.type]} /></p>
      <p><span className="text-slate-500"><LocalizedText text="Quantity:" /></span> {movement.quantity.toLocaleString()}</p>
      <p><span className="text-slate-500"><LocalizedText text="Reference:" /></span> {movement.reference}</p>
      <p><span className="text-slate-500"><LocalizedText text="Created by:" /></span> {movement.createdBy}</p>
      <p><span className="text-slate-500"><LocalizedText text="Date:" /></span> {new Date(movement.createdAt).toLocaleString()}</p>
      {movement.notes && (
        <p className="sm:col-span-2"><span className="text-slate-500"><LocalizedText text="Notes:" /></span> {movement.notes}</p>
      )}
    </div>
  );
}
