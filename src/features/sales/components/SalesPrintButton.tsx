// ============================================================
// FILE 187
// PATH: E:\BRICKSCS\src\features\sales\components\SalesPrintButton.tsx
// ============================================================

import { Printer } from "lucide-react";

interface SalesPrintButtonProps {
  label?: string;
  disabled?: boolean;
}

export default function SalesPrintButton({ label = "Print invoice", disabled = false }: SalesPrintButtonProps) {
  return (
    <button type="button" disabled={disabled} onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm disabled:opacity-50 dark:border-slate-700">
      <Printer size={16} /> {label}
    </button>
  );
}
