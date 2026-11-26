// FILE 511: src/features/wages/wages.service.ts
import type { WageInput, WageRecord } from "./wages.types";
import { validateWage } from "./wages.utils";

/**
 * Local module adapter placeholder.
 * Replace this in the integration phase with Tauri commands backed by SQLite.
 * Financial records must be reversed/voided with an audit event, not hard-deleted.
 */
const records: WageRecord[] = [];

export async function listWages(): Promise<WageRecord[]> {
  return [...records];
}

export async function createWage(input: WageInput): Promise<WageRecord> {
  const errors = validateWage(input);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const record: WageRecord = {
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
