// ============================================================
// FILE 127
// PATH: E:\BRICKSCS\src\features\production\components\NikasiForm.tsx
// ============================================================

import { useState } from "react";

export interface NikasiRecord {
  batchId: number;
  workerName: string;
  goodQuantity: number;
  damagedQuantity: number;
  date: string;
  notes: string;
}

interface NikasiFormProps {
  batchId: number;
  onSubmit: (record: NikasiRecord) => void;
}

export default function NikasiForm({
  batchId,
  onSubmit,
}: NikasiFormProps) {
  const [workerName, setWorkerName] = useState("");
  const [goodQuantity, setGoodQuantity] = useState(0);
  const [damagedQuantity, setDamagedQuantity] = useState(0);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workerName.trim()) {
      setError("Worker name is required.");
      return;
    }

    if (
      !Number.isSafeInteger(goodQuantity) ||
      !Number.isSafeInteger(damagedQuantity) ||
      goodQuantity < 0 ||
      damagedQuantity < 0 ||
      goodQuantity + damagedQuantity <= 0
    ) {
      setError("Enter valid brick quantities.");
      return;
    }

    setError("");

    onSubmit({
      batchId,
      workerName: workerName.trim(),
      goodQuantity,
      damagedQuantity,
      date,
      notes: notes.trim(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Nikasi unloading entry
      </h3>

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}

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
        Good bricks
        <input
          type="text"
          inputMode="numeric"
          value={goodQuantity}
          onFocus={(event) => {
            if (goodQuantity === 0) event.currentTarget.select();
          }}
          onChange={(event) => {
            if (/^\d*$/.test(event.target.value)) {
              setGoodQuantity(Number(event.target.value));
            }
          }}
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Damaged bricks
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
          className="mt-1 w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <label className="block text-sm">
        Date
        <input
          type="date"
          required
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
        Save Nikasi entry
      </button>
    </form>
  );
}
