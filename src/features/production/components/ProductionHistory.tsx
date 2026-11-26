// ============================================================
// FILE 130
// PATH: E:\BRICKSCS\src\features\production\components\ProductionHistory.tsx
// ============================================================

import { History } from "lucide-react";

export interface ProductionHistoryRecord {
  id: number;
  action: string;
  description: string;
  userName: string;
  date: string;
}

interface ProductionHistoryProps {
  records: ProductionHistoryRecord[];
}

export default function ProductionHistory({
  records,
}: ProductionHistoryProps) {
  if (!records.length) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500 dark:border-slate-700">
        No production history is available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <History size={17} />
          </div>

          <div className="min-w-0 flex-1 border-b border-slate-100 pb-4 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {record.action}
            </p>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {record.description}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {record.userName} · {record.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
