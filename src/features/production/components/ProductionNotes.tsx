// ============================================================
// FILE 135
// PATH: E:\BRICKSCS\src\features\production\components\ProductionNotes.tsx
// ============================================================

interface ProductionNotesProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function ProductionNotes({
  value,
  onChange,
  maxLength = 1000,
  label = "Production notes",
  placeholder = "Enter additional production information...",
  disabled = false,
}: ProductionNotesProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <textarea
        rows={4}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      <span className="mt-1 block text-right text-xs text-slate-400">
        {value.length}/{maxLength}
      </span>
    </label>
  );
}
