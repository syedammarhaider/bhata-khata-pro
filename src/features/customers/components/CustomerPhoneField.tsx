// ============================================================
// FILE 351
// PATH: src/features/customers/components/CustomerPhoneField.tsx
// ============================================================

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export default function CustomerPhoneField({
  value,
  onChange,
  label = "Phone Number",
  required = false,
}: Props) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type="tel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder="03XX-XXXXXXX"
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}
