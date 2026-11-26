// ============================================================
// FILE 328
// PATH: src/features/customers/components/CustomerForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import type { CustomerInput } from "../customers.types";

interface Props {
  initialValue?: Partial<CustomerInput>;
  onSubmit: (customer: CustomerInput) => void;
  onCancel?: () => void;
}

export default function CustomerForm({
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [phone, setPhone] = useState(initialValue?.phone ?? "");
  const [alternatePhone, setAlternatePhone] = useState(initialValue?.alternatePhone ?? "");
  const [address, setAddress] = useState(initialValue?.address ?? "");
  const [city, setCity] = useState(initialValue?.city ?? "");
  const [openingBalance, setOpeningBalance] = useState(String(initialValue?.openingBalance ?? 0));
  const [creditLimit, setCreditLimit] = useState(String(initialValue?.creditLimit ?? 0));
  const [notes, setNotes] = useState(initialValue?.notes ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name,
      phone,
      alternatePhone,
      address,
      city,
      openingBalance: Number(openingBalance),
      creditLimit: Number(creditLimit),
      notes,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Customer Name *
          <input value={name} onChange={(event) => setName(event.target.value)} required className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium">
          Phone Number *
          <input value={phone} onChange={(event) => setPhone(event.target.value)} required className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium">
          Alternate Phone
          <input value={alternatePhone} onChange={(event) => setAlternatePhone(event.target.value)} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium">
          City
          <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium sm:col-span-2">
          Address
          <input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium">
          Opening Balance (PKR)
          <input type="number" step="0.01" value={openingBalance} onChange={(event) => setOpeningBalance(event.target.value)} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium">
          Credit Limit (PKR)
          <input type="number" min="0" step="0.01" value={creditLimit} onChange={(event) => setCreditLimit(event.target.value)} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>

        <label className="block text-sm font-medium sm:col-span-2">
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
        </label>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>
        )}
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
          Save Customer
        </button>
      </div>
    </form>
  );
}
