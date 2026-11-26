// ============================================================
// FILE 291
// PATH: src/features/inventory/components/StockMovementTable.tsx
// ============================================================

import type { StockMovement } from "../inventory.types";
import { MOVEMENT_LABELS } from "../inventory.constants";

export default function StockMovementTable({
  movements,
}: {
  movements: StockMovement[];
}) {
  if (!movements.length) {
    return <p className="py-8 text-center text-sm text-slate-500">No stock movements recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase text-slate-500">
            <th className="p-3">Date</th>
            <th className="p-3">Grade</th>
            <th className="p-3">Movement</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Reference</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id} className="border-b border-slate-100 dark:border-slate-800">
              <td className="p-3">{new Date(movement.createdAt).toLocaleDateString()}</td>
              <td className="p-3">{movement.gradeName}</td>
              <td className="p-3">{MOVEMENT_LABELS[movement.type]}</td>
              <td className="p-3">{movement.quantity.toLocaleString()}</td>
              <td className="p-3">{movement.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
