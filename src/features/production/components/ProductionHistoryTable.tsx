// ============================================================
// FILE 131
// PATH: E:\BRICKSCS\src\features\production\components\ProductionHistoryTable.tsx
// ============================================================

import type { ProductionHistoryRecord } from "./ProductionHistory";

interface ProductionHistoryTableProps {
  records: ProductionHistoryRecord[];
}

export default function ProductionHistoryTable({
  records,
}: ProductionHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="p-3">Action</th>
            <th className="p-3">Description</th>
            <th className="p-3">User</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {records.map((record) => (
            <tr key={record.id}>
              <td className="p-3 font-medium">{record.action}</td>
              <td className="p-3">{record.description}</td>
              <td className="p-3">{record.userName}</td>
              <td className="p-3 whitespace-nowrap">{record.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
