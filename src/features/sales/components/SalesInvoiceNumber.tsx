// ============================================================
// FILE 195
// PATH: E:\BRICKSCS\src\features\sales\components\SalesInvoiceNumber.tsx
// ============================================================

import { FileText } from "lucide-react";

interface SalesInvoiceNumberProps {
  value: string;
  label?: string;
}

export default function SalesInvoiceNumber({ value, label = "Invoice number" }: SalesInvoiceNumberProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
        <FileText size={16} className="text-indigo-600" /> {value}
      </p>
    </div>
  );
}
