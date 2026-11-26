import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  ProductionFormData,
  ProductionResource,
  ProductionStage,
} from "../production.types";
import {
  PRODUCTION_STAGES,
  PRODUCTION_VALIDATION,
} from "../production.constants";
import ProductionGradeSelect from "./ProductionGradeSelect";

interface ProductionBatchFormProps {
  onSubmit: (data: ProductionFormData) => void;
  onClose: () => void;
}

export default function ProductionBatchForm({
  onSubmit,
  onClose,
}: ProductionBatchFormProps) {
  const [batchNumber, setBatchNumber] = useState("");
  const [brickGrade, setBrickGrade] = useState("A Grade");
  const [quantity, setQuantity] = useState<number>(0);
  const [stage, setStage] = useState<ProductionStage>("pathai");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [resources, setResources] = useState<ProductionResource[]>([]);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!batchNumber.trim()) {
      setError("Batch number is required.");
      return;
    }

    if (batchNumber.trim().length > PRODUCTION_VALIDATION.batchNumberMaxLength) {
      setError(
        `Batch number must be ${PRODUCTION_VALIDATION.batchNumberMaxLength} characters or fewer.`,
      );
      return;
    }

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < PRODUCTION_VALIDATION.minimumQuantity ||
      quantity > PRODUCTION_VALIDATION.maximumQuantity
    ) {
      setError(
        `Quantity must be between ${PRODUCTION_VALIDATION.minimumQuantity} and ${PRODUCTION_VALIDATION.maximumQuantity.toLocaleString("en-PK")}.`,
      );
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (expectedDate && expectedDate < startDate) {
      setError("Expected date cannot be earlier than the start date.");
      return;
    }

    if (notes.length > PRODUCTION_VALIDATION.notesMaxLength) {
      setError(
        `Notes must be ${PRODUCTION_VALIDATION.notesMaxLength} characters or fewer.`,
      );
      return;
    }

    onSubmit({
      batchNumber: batchNumber.trim(),
      brickGrade,
      quantity,
      stage,
      startDate,
      expectedDate,
      notes: notes.trim(),
      resources: resources.filter((resource) => resource.resourceName.trim()),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Create production batch
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
          >
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Batch number
            </span>
            <input
              required
              maxLength={PRODUCTION_VALIDATION.batchNumberMaxLength}
              value={batchNumber}
              onChange={(event) => setBatchNumber(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              placeholder="PB-2026-001"
            />
          </label>

          <ProductionGradeSelect
            value={brickGrade}
            onChange={setBrickGrade}
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Planned quantity
            </span>
            <input
              required
              type="number"
              min={PRODUCTION_VALIDATION.minimumQuantity}
              max={PRODUCTION_VALIDATION.maximumQuantity}
              step="1"
              value={quantity || ""}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Production stage
            </span>
            <select
              value={stage}
              onChange={(event) =>
                setStage(event.target.value as ProductionStage)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            >
              {PRODUCTION_STAGES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Start date
            </span>
            <input
              required
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Expected date
            </span>
            <input
              type="date"
              min={startDate || undefined}
              value={expectedDate}
              onChange={(event) => setExpectedDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Notes
          </span>
          <textarea
            rows={3}
            maxLength={PRODUCTION_VALIDATION.notesMaxLength}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Optional batch notes"
          />
        </label>

        <section className="mt-5 space-y-3 rounded-xl border p-4 dark:border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Resource usage</h3>
              <p className="text-xs text-slate-500">Record fuel, coal, labour, or other batch inputs and unit cost.</p>
            </div>
            <button type="button" onClick={() => setResources((items) => [...items, {
              id: 0, resourceName: "", quantity: 0, unit: "", unitCost: 0,
            }])} className="rounded-lg border px-3 py-2 text-xs font-medium">
              Add resource
            </button>
          </div>
          {resources.map((resource, index) => (
            <div key={`${index}-${resource.id}`} className="grid gap-2 md:grid-cols-[1.2fr_1fr_0.8fr_1fr_auto]">
              <input aria-label="Resource name" value={resource.resourceName} onChange={(event) => setResources((items) => items.map((item, i) => i === index ? { ...item, resourceName: event.target.value } : item))} placeholder="Coal" className="rounded-lg border px-3 py-2 text-sm" />
              <input aria-label="Resource quantity" type="number" min="0" step="0.01" value={resource.quantity || ""} onChange={(event) => setResources((items) => items.map((item, i) => i === index ? { ...item, quantity: Number(event.target.value) } : item))} placeholder="Quantity" className="rounded-lg border px-3 py-2 text-sm" />
              <input aria-label="Resource unit" value={resource.unit} onChange={(event) => setResources((items) => items.map((item, i) => i === index ? { ...item, unit: event.target.value } : item))} placeholder="kg / bag" className="rounded-lg border px-3 py-2 text-sm" />
              <input aria-label="Resource unit cost" type="number" min="0" step="0.01" value={resource.unitCost || ""} onChange={(event) => setResources((items) => items.map((item, i) => i === index ? { ...item, unitCost: Number(event.target.value) } : item))} placeholder="Unit cost PKR" className="rounded-lg border px-3 py-2 text-sm" />
              <button type="button" onClick={() => setResources((items) => items.filter((_, i) => i !== index))} aria-label="Remove resource" className="rounded-lg border px-3 py-2 text-sm text-red-600">Remove</button>
            </div>
          ))}
          {resources.length > 0 && (
            <p className="text-right text-sm font-medium">
              Resource total: PKR {resources.reduce((total, item) => total + item.quantity * item.unitCost, 0).toLocaleString("en-PK")}
            </p>
          )}
        </section>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create batch
          </button>
        </div>
      </form>
    </div>
  );
}
