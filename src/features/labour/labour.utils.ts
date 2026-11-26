// FILE 461: src/features/labour/labour.utils.ts
import type { WorkerInput, WorkerRecord } from "./labour.types";

export function normalizeWorkerName(value: string): string {
  return value.trim().replace(/\\s+/g, " ");
}

export function validateWorker(input: WorkerInput): string[] {
  const errors: string[] = [];
  if (!normalizeWorkerName(input.name)) errors.push("Worker name is required.");
  if (input.name.trim().length > 120) errors.push("Worker name must be 120 characters or fewer.");
  if (input.openingBalance !== undefined && (!Number.isFinite(input.openingBalance) || input.openingBalance < 0)) {
    errors.push("Opening balance must be a non-negative number.");
  }
  return errors;
}

export function filterWorkers(records: WorkerRecord[], search: string): WorkerRecord[] {
  const term = search.trim().toLocaleLowerCase();
  if (!term) return records;
  return records.filter((record) =>
    [record.name, record.phone ?? "", record.email ?? ""].some((value) =>
      value.toLocaleLowerCase().includes(term)
    )
  );
}

export function calculateRunningBalance(entries: Array<{ debit: number; credit: number }>, opening = 0): number {
  return entries.reduce((balance, entry) => balance + entry.debit - entry.credit, opening);
}
