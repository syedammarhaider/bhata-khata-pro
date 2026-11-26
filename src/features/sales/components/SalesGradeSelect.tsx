// ============================================================
// FILE 198
// PATH: E:\BRICKSCS\src\features\sales\components\SalesGradeSelect.tsx
// ============================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface SalesGradeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SalesGradeSelect({ value, onChange }: SalesGradeSelectProps) {
  const [grades, setGrades] = useState<{ name: string; selling_price: number }[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    invoke<{ name: string; selling_price: number; is_active: boolean }[]>("get_brick_grades")
      .then((items) => setGrades(items.filter((item) => item.is_active)))
      .catch((err) => setError(String(err)));
  }, []);
  return (
    <label className="block text-sm">
      Brick grade
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800">
        {!grades.some((grade) => grade.name === value) && value && <option value={value}>{value} (inactive)</option>}
        {grades.map((grade) => <option key={grade.name} value={grade.name}>{grade.name}</option>)}
      </select>
      {error && <span role="alert" className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}
