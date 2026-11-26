// ============================================================
// FILE 174
// PATH: E:\BRICKSCS\src\features\sales\components\SalesSearch.tsx
// ============================================================

import { Search, X } from "lucide-react";

interface SalesSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SalesSearch({
  value,
  onChange,
  placeholder = "Search sales...",
}: SalesSearchProps) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900" />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
