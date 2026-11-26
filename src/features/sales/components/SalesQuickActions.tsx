// ============================================================
// FILE 197
// PATH: E:\BRICKSCS\src\features\sales\components\SalesQuickActions.tsx
// ============================================================

import { Plus, Download, Printer } from "lucide-react";

interface SalesQuickActionsProps {
  onNewSale: () => void;
  onExport?: () => void;
  onPrint?: () => void;
}

export default function SalesQuickActions({ onNewSale, onExport, onPrint }: SalesQuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onNewSale} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
        <Plus size={16} /> New sale
      </button>
      {onExport && (
        <button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
          <Download size={16} /> Export
        </button>
      )}
      {onPrint && (
        <button type="button" onClick={onPrint} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
          <Printer size={16} /> Print
        </button>
      )}
    </div>
  );
}
