// ============================================================
// FILE 194
// PATH: E:\BRICKSCS\src\features\sales\components\SalesNotesField.tsx
// ============================================================

interface SalesNotesFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function SalesNotesField({ value, onChange, maxLength = 1000 }: SalesNotesFieldProps) {
  return (
    <label className="block text-sm">
      Sale notes
      <textarea rows={3} maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Optional notes for this sale..." className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
      <span className="mt-1 block text-right text-xs text-slate-400">{value.length}/{maxLength}</span>
    </label>
  );
}
