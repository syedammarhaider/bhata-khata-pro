// FILE 548: src/features/backup-restore/backuprestore.service.ts
import type { BackupInput, BackupRecord } from "./backuprestore.types";
import { validateBackup } from "./backuprestore.utils";

/**
 * Local module adapter placeholder.
 * Replace this in the integration phase with Tauri commands backed by SQLite.
 * Financial records must be reversed/voided with an audit event, not hard-deleted.
 */
const records: BackupRecord[] = [];

export async function listBackups(): Promise<BackupRecord[]> {
  return [...records];
}

export async function createBackup(input: BackupInput): Promise<BackupRecord> {
  const errors = validateBackup(input);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const record: BackupRecord = {
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
