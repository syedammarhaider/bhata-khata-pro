// ============================================================
// FILE 192
// PATH: E:\BRICKSCS\src\features\sales\components\SalesQuantityField.tsx
// ============================================================

import { useEffect, useState } from "react";

interface SalesQuantityFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  max?: number;
}

export default function SalesQuantityField({ value, onChange, label = "Quantity (bricks)", max = 100_000_000 }: SalesQuantityFieldProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText((current) => {
      const parsed = Number(current);
      if (current !== "" && Number.isFinite(parsed) && parsed === value) return current;
      return String(value);
    });
  }, [value]);

  return (
    <label className="block text-sm">
      {label}
      <input
        type="text"
        inputMode="numeric"
        required
        value={text}
        onChange={(event) => {
          const cleaned = event.target.value.replace(/[^0-9]/g, "");
          setText(cleaned);
          const parsed = cleaned === "" ? 0 : Number(cleaned);
          onChange(Number.isFinite(parsed) ? Math.min(max, Math.max(0, parsed)) : 0);
        }}
        className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
      />
    </label>
  );
}
