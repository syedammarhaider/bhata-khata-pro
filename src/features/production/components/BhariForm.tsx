// ============================================================
// FILE 126
// PATH: E:\BRICKSCS\src\features\production\components\BhariForm.tsx
// ============================================================

import { useState } from "react";

export interface BhariRecord {
  batchId: number;
  workerName: string;
  loadedQuantity: number;
  kilnSection: string;
  date: string;
  notes: string;
}

interface BhariFormProps {
  batchId: number;
  onSubmit: (record: BhariRecord) => void;
}

export default function BhariForm({
  batchId,
  onSubmit,
}: BhariFormProps) {
  const [workerName, setWorkerName] = useState("");
  const [loadedQuantity, setLoadedQuantity] = useState(0);
  const [kilnSection, setKilnSection] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !workerName.trim() ||
      !Number.isSafeInteger(loadedQuantity) ||
      loadedQuantity <= 0
    ) {
      return;
    }

    onSubmit({
      batchId,
      workerName: workerName.trim(),
      loadedQuantity,
      kilnSection: kilnSection.trim(),
      date,
      notes: notes.trim(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Bhari loading entry
      </h3>

      <label className="block text-sm">
        Worker name
        <input
          required
          value={workerName}
          onChange={(event) => setWorkerName(event.target.value)}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Loaded quantity
        <input
          required
          type="text"
          inputMode="numeric"
          value={loadedQuantity}
          onFocus={(event) => {
            if (loadedQuantity === 0) event.currentTarget.select();
          }}
          onChange={(event) => {
            if (/^\d*$/.test(event.target.value)) {
              setLoadedQuantity(Number(event.target.value));
            }
          }}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Kiln section
        <input
          value={kilnSection}
          onChange={(event) => setKilnSection(event.target.value)}
          placeholder="e.g. Section A"
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Date
        <input
          required
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Notes
        <textarea
          rows={2}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
      >
        Save Bhari entry
      </button>
    </form>
  );
}
