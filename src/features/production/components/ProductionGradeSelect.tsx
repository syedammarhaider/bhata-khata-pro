// ============================================================
// FILE 133
// PATH: E:\BRICKSCS\src\features\production\components\ProductionGradeSelect.tsx
// ============================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface ProductionGradeSelectProps {
  value: string;
  onChange: (value: string) => void;
  grades?: string[];
  label?: string;
  disabled?: boolean;
}

export default function ProductionGradeSelect({
  value,
  onChange,
  grades,
  label = "Brick grade",
  disabled = false,
}: ProductionGradeSelectProps) {
  const [loadedGrades, setLoadedGrades] = useState<string[]>([]);
  useEffect(() => {
    if (grades) return;
    void invoke<{ name: string; is_active: boolean }[]>("get_brick_grades")
      .then((items) => setLoadedGrades(items.filter((item) => item.is_active).map((item) => item.name)))
      .catch(() => setLoadedGrades([]));
  }, [grades]);
  const options = grades ?? loadedGrades;
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      >
        {options.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </label>
  );
}
