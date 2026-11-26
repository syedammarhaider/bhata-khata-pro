// ============================================================
// FILE 337
// PATH: src/features/customers/components/CustomerSelect.tsx
// ============================================================

import type { Customer } from "../customers.types";

interface Props {
  customers: Customer[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerSelect({ customers, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
    >
      <option value="">Select customer</option>
      {customers.map((customer) => (
        <option key={customer.id} value={customer.id}>
          {customer.name} — {customer.phone}
        </option>
      ))}
    </select>
  );
}
