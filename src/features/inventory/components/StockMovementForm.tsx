// ============================================================
// FILE 292
// PATH: src/features/inventory/components/StockMovementForm.tsx
// ============================================================

import { useState, type FormEvent } from "react";
import type { StockMovementInput, StockMovementType } from "../inventory.types";
import { MOVEMENT_OPTIONS } from "../inventory.constants";

interface Props {
  itemId: string;
  onSubmit: (movement: StockMovementInput) => void;
  onCancel?: () => void;
}

export default function StockMovementForm({ itemId, onSubmit, onCancel }: Props) {
  const [type, setType] = useState<StockMovementType>("in");
  const [quantity, setQuantity] = useState("1");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;
    if (!reference.trim()) return;

    onSubmit({
      itemId,
      type,
      quantity: parsedQuantity,
      reference: reference.trim(),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Movement Type
        <select
          value={type}
          onChange={(event) => setType(event.target.value as StockMovementType)}
          className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
        >
          {MOVEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Quantity
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
        Reference
        <input
          value={reference}
          onChange={(event) => setReference(event.target.value)}
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
          rows={3}
        />
      </label>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>
        )}
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
          Save Movement
        </button>
      </div>
    </form>
  );
}
