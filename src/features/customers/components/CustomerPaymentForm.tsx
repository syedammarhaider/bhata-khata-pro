// ============================================================
// FILE 334
// PATH: src/features/customers/components/CustomerPaymentForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import type { CustomerPaymentInput } from "../customers.types";
import { CUSTOMER_PAYMENT_METHODS } from "../customers.constants";

interface Props {
  customerId: string;
  onSubmit: (payment: CustomerPaymentInput) => void;
  onCancel?: () => void;
}

export default function CustomerPaymentForm({
  customerId,
  onSubmit,
  onCancel,
}: Props) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || !reference.trim()) return;

    onSubmit({
      customerId,
      amount: value,
      date,
      method,
      reference: reference.trim(),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Payment Amount (PKR)
        <input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
      </label>

      <label className="block text-sm font-medium">
        Payment Date
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
      </label>

      <label className="block text-sm font-medium">
        Payment Method
        <select value={method} onChange={(event) => setMethod(event.target.value)} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900">
          {CUSTOMER_PAYMENT_METHODS.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Receipt Reference
        <input value={reference} onChange={(event) => setReference(event.target.value)} required className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
      </label>

      <label className="block text-sm font-medium">
        Notes
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
      </label>

      <div className="flex justify-end gap-2">
        {onCancel && <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>}
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">Record Payment</button>
      </div>
    </form>
  );
}
