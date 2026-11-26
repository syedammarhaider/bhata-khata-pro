// FILE 462: src/features/labour/labour.service.ts
import type { WorkerInput, WorkerRecord } from "./labour.types";
import { validateWorker } from "./labour.utils";

/**
 * Local module adapter placeholder.
 * Replace this in the integration phase with Tauri commands backed by SQLite.
 * Financial records must be reversed/voided with an audit event, not hard-deleted.
 */
const records: WorkerRecord[] = [];

export async function listWorkers(): Promise<WorkerRecord[]> {
  return [...records];
}

export async function createWorker(input: WorkerInput): Promise<WorkerRecord> {
  const errors = validateWorker(input);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const record: WorkerRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    phone: input.phone?.trim(),
    email: input.email?.trim(),
    notes: input.notes?.trim(),
    openingBalance: input.openingBalance ?? 0,
    currentBalance: input.openingBalance ?? 0,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  records.unshift(record);
  return record;
}
