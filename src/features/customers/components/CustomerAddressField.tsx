// ============================================================
// FILE 352
// PATH: src/features/customers/components/CustomerAddressField.tsx
// ============================================================

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerAddressField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      Address
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={2}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}
