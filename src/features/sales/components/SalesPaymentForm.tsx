// ============================================================
// FILE 180
// PATH: E:\BRICKSCS\src\features\sales\components\SalesPaymentForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { SaleRecord, SalesPaymentFormData } from "../sales.types";
import { SALES_PAYMENT_METHODS } from "../sales.constants";

interface SalesPaymentFormProps {
  sale: SaleRecord;
  onSubmit: (data: SalesPaymentFormData) => void;
  onClose: () => void;
}

export default function SalesPaymentForm({ sale, onSubmit, onClose }: SalesPaymentFormProps) {
  const [amount, setAmount] = useState(sale.dueAmount);
  const [method, setMethod] = useState<SalesPaymentFormData["method"]>("cash");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!Number.isFinite(amount) || amount <= 0 || amount > sale.dueAmount) {
      setError("Payment must be positive and cannot exceed the outstanding balance.");
      return;
    }

    onSubmit({ saleId: sale.id, amount, method, reference, date, notes });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Record customer payment</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <p className="text-sm text-slate-500">{sale.invoiceNumber} · Outstanding PKR {sale.dueAmount.toLocaleString("en-PK")}</p>
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        <label className="block text-sm">Payment amount (PKR)
          <input type="number" min="0.01" step="0.01" max={sale.dueAmount} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="block text-sm">Payment method
          <select value={method} onChange={(event) => setMethod(event.target.value as SalesPaymentFormData["method"])} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800">
            {SALES_PAYMENT_METHODS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="block text-sm">Reference (optional)
          <input value={reference} onChange={(event) => setReference(event.target.value)} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="block text-sm">Payment date
          <input type="date" required value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="block text-sm">Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">Save payment</button>
        </div>
      </form>
    </div>
  );
}
