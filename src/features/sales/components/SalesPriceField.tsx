// ============================================================
// FILE 193
// PATH: E:\BRICKSCS\src\features\sales\components\SalesPriceField.tsx
// ============================================================

import { useEffect, useState } from "react";

interface SalesPriceFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function SalesPriceField({ value, onChange, label = "Price per brick (PKR)" }: SalesPriceFieldProps) {
  const [text, setText] = useState(value ? String(value) : "");

  useEffect(() => {
    setText((current) => {
      const parsed = Number(current);
      if (current !== "" && Number.isFinite(parsed) && parsed === value) return current;
      return value ? String(value) : "";
    });
  }, [value]);

  return (
    <label className="block text-sm">
      {label}
      <input
        type="text"
        inputMode="decimal"
        required
        value={text}
        onChange={(event) => {
          const raw = event.target.value.replace(/[^0-9.]/g, "");
          // Keep only the first decimal point
          const parts = raw.split(".");
          const cleaned = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw;
          setText(cleaned);
          const parsed = Number(cleaned);
          onChange(cleaned === "" || !Number.isFinite(parsed) ? 0 : Math.max(0, parsed));
        }}
        className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
      />
    </label>
  );
}
