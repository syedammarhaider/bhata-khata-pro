// ============================================================
// FILE 125
// PATH: E:\BRICKSCS\src\features\production\components\PathaiForm.tsx
// ============================================================

import { useState } from "react";

export interface PathaiRecord {
  batchId: number;
  workerName: string;
  brickGrade: string;
  quantity: number;
  date: string;
  notes: string;
}

interface PathaiFormProps {
  batchId: number;
  onSubmit: (record: PathaiRecord) => void;
}

export default function PathaiForm({
  batchId,
  onSubmit,
}: PathaiFormProps) {
  const [workerName, setWorkerName] = useState("");
  const [brickGrade, setBrickGrade] = useState("A Grade");
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workerName.trim() || !Number.isSafeInteger(quantity) || quantity <= 0) {
      return;
    }

    onSubmit({
      batchId,
      workerName: workerName.trim(),
      brickGrade,
      quantity,
      date,
      notes: notes.trim(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Pathai production entry
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
        Brick grade
        <select
          value={brickGrade}
          onChange={(event) => setBrickGrade(event.target.value)}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <option>A Grade</option>
          <option>B Grade</option>
          <option>C Grade</option>
          <option>Special Grade</option>
        </select>
      </label>

      <label className="block text-sm">
        Quantity
        <input
          required
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
        Save Pathai entry
      </button>
    </form>
  );
}
