// ============================================================
// FILE 349
// PATH: src/features/customers/components/CustomerOpeningBalanceField.tsx
// ============================================================

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function CustomerOpeningBalanceField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      Opening Balance (PKR)
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
      <span className="mt-1 block text-xs text-slate-500">
        Positive means customer owes the business; negative means customer advance.
      </span>
    </label>
  );
}
