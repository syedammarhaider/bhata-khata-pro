// ============================================================
// FILE 172
// PATH: E:\BRICKSCS\src\features\sales\components\SalesItemsTable.tsx
// ============================================================

import { Trash2 } from "lucide-react";
import type { SalesItem } from "../sales.types";
import { formatSalesAmount, formatSalesQuantity } from "../sales.utils";

interface SalesItemsTableProps {
  items: SalesItem[];
  onRemove: (id: number) => void;
}

export default function SalesItemsTable({
  items,
  onRemove,
}: SalesItemsTableProps) {
  if (!items.length) {
    return <p className="rounded-lg border border-dashed p-5 text-center text-sm text-slate-500">No brick items added yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border dark:border-slate-700">
      <table className="w-full min-w-[550px] text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="p-3">Grade</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Rate</th>
            <th className="p-3">Total</th>
            <th className="p-3">Remove</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-700">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="p-3">{item.brickGrade}</td>
              <td className="p-3">{formatSalesQuantity(item.quantity)}</td>
              <td className="p-3">{formatSalesAmount(item.unitPrice)}</td>
              <td className="p-3 font-semibold">{formatSalesAmount(item.quantity * item.unitPrice)}</td>
              <td className="p-3">
                <button type="button" onClick={() => onRemove(item.id)} aria-label="Remove item" className="rounded p-2 text-rose-600 hover:bg-rose-50">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
