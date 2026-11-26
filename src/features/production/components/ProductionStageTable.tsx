// ============================================================
// FILE 124
// PATH: E:\BRICKSCS\src\features\production\components\ProductionStageTable.tsx
// ============================================================

import type { ProductionStageUpdate } from "../production.types";
import ProductionStageBadge from "./ProductionStageBadge";

interface ProductionStageRecord {
  id: number;
  stage: ProductionStageUpdate["stage"];
  quantity: number;
  damagedQuantity: number;
  date: string;
  notes?: string;
}

interface ProductionStageTableProps {
  records: ProductionStageRecord[];
}

export default function ProductionStageTable({
  records,
}: ProductionStageTableProps) {
  if (!records.length) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500 dark:border-slate-700">
        No production stage records available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="p-3">Stage</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Damaged</th>
            <th className="p-3">Date</th>
            <th className="p-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {records.map((record) => (
            <tr key={record.id}>
              <td className="p-3">
                <ProductionStageBadge stage={record.stage} />
              </td>
              <td className="p-3">{record.quantity.toLocaleString("en-PK")}</td>
              <td className="p-3">{record.damagedQuantity.toLocaleString("en-PK")}</td>
              <td className="p-3">{record.date}</td>
              <td className="max-w-48 truncate p-3">{record.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
