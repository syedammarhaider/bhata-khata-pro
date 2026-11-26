// ============================================================
// FILE 188
// PATH: E:\BRICKSCS\src\features\sales\components\SalesReturnForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { SaleRecord, SalesReturnFormData } from "../sales.types";

interface SalesReturnFormProps {
  sale: SaleRecord;
  onSubmit: (data: SalesReturnFormData) => void;
  onClose: () => void;
}

export default function SalesReturnForm({ sale, onSubmit, onClose }: SalesReturnFormProps) {
  const [brickGrade, setBrickGrade] = useState(sale.items[0]?.brickGrade ?? "");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brickGrade || !Number.isSafeInteger(quantity) || quantity <= 0 || !reason.trim()) {
      setError("Complete all required return details.");
      return;
    }
    onSubmit({ saleId: sale.id, brickGrade, quantity, reason: reason.trim(), date });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Record sales return</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <p className="text-sm text-slate-500">{sale.invoiceNumber} · {sale.customerName}</p>
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        <label className="block text-sm">Brick grade
          <select value={brickGrade} onChange={(event) => setBrickGrade(event.target.value)} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800">
            {sale.items.map((item) => <option key={item.id} value={item.brickGrade}>{item.brickGrade}</option>)}
          </select>
        </label>
        <label className="block text-sm">Return quantity
          <input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="block text-sm">Reason
          <textarea required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="block text-sm">Return date
          <input type="date" required value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">Submit return</button>
        </div>
      </form>
    </div>
  );
}
