// ============================================================
// FILE 293
// PATH: src/features/inventory/components/StockAdjustmentForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import type { StockAdjustment } from "../inventory.types";

interface Props {
  itemId: string;
  onSubmit: (adjustment: StockAdjustment) => void;
}

export default function StockAdjustmentForm({ itemId, onSubmit }: Props) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(quantity);

    if (!Number.isFinite(value) || value <= 0 || !reason.trim()) return;

    onSubmit({
      itemId,
      quantity: value,
      reason: reason.trim(),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Adjustment Quantity
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Reason
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
        />
      </label>

      <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
        Submit Adjustment
      </button>
    </form>
  );
}
