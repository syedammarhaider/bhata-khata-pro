// ============================================================
// FILE 170
// PATH: E:\BRICKSCS\src\features\sales\components\SalesCustomerSelect.tsx
// ============================================================

import type { SalesCustomer } from "../sales.types";

interface SalesCustomerSelectProps {
  customers: SalesCustomer[];
  customerId: number;
  customerName: string;
  customerPhone: string;
  onCustomerChange: (customer: SalesCustomer) => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export default function SalesCustomerSelect({
  customers,
  customerId,
  customerName,
  customerPhone,
  onCustomerChange,
  onNameChange,
  onPhoneChange,
}: SalesCustomerSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">
        Existing customer
        <select
          value={customerId}
          onChange={(event) => {
            const selected = customers.find(
              (customer) => customer.id === Number(event.target.value),
            );
            if (selected) onCustomerChange(selected);
          }}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <option value={0}>Select a customer or enter a new one below</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Customer name
        <input
          required
          value={customerName}
          onChange={(event) => onNameChange(event.target.value)}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Phone number
        <input
          value={customerPhone}
          onChange={(event) => onPhoneChange(event.target.value)}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>
    </div>
  );
}
