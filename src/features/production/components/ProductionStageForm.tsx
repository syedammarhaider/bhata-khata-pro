// ============================================================
// FILE 123
// PATH: E:\BRICKSCS\src\features\production\components\ProductionStageForm.tsx
// ============================================================

import { useState } from "react";
import { X } from "lucide-react";
import type {
  ProductionStage,
  ProductionStageUpdate,
} from "../production.types";
import { PRODUCTION_STAGES } from "../production.constants";

interface ProductionStageFormProps {
  batchId: number;
  currentStage: ProductionStage;
  onSubmit: (data: ProductionStageUpdate) => void;
  onClose: () => void;
}

export default function ProductionStageForm({
  batchId,
  currentStage,
  onSubmit,
  onClose,
}: ProductionStageFormProps) {
  const [stage, setStage] = useState<ProductionStage>(currentStage);
  const [quantity, setQuantity] = useState(0);
  const [damagedQuantity, setDamagedQuantity] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      setError("Enter a valid production quantity.");
      return;
    }

    if (
      !Number.isSafeInteger(damagedQuantity) ||
      damagedQuantity < 0 ||
      damagedQuantity > quantity
    ) {
      setError("Damaged quantity cannot exceed produced quantity.");
      return;
    }

    onSubmit({
      batchId,
      stage,
      quantity,
      damagedQuantity,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Update production stage
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Production stage
          </span>
          <select
            value={stage}
            onChange={(event) =>
              setStage(event.target.value as ProductionStage)
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            {PRODUCTION_STAGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Produced quantity
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={quantity}
            onFocus={(event) => {
              if (quantity === 0) event.currentTarget.select();
            }}
            onChange={(event) => {
              if (/^\d*$/.test(event.target.value)) {
                setQuantity(Number(event.target.value));
              }
            }}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Damaged quantity
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={damagedQuantity}
            onFocus={(event) => {
              if (damagedQuantity === 0) event.currentTarget.select();
            }}
            onChange={(event) => {
              if (/^\d*$/.test(event.target.value)) {
                setDamagedQuantity(Number(event.target.value));
              }
            }}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={1000}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save stage
          </button>
        </div>
      </form>
    </div>
  );
}
