// ============================================================
// FILE 350
// PATH: src/features/customers/components/CustomerCreditLimitField.tsx
// ============================================================

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function CustomerCreditLimitField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      Credit Limit (PKR)
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}
