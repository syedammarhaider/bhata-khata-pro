// ============================================================
// FILE 353
// PATH: src/features/customers/components/CustomerNotesField.tsx
// ============================================================

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerNotesField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      Customer Notes
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}
