// FILE 547: src/features/backup-restore/backuprestore.utils.ts
import type { BackupInput, BackupRecord } from "./backuprestore.types";

export function normalizeBackupName(value: string): string {
  return value.trim().replace(/\\s+/g, " ");
}

export function validateBackup(input: BackupInput): string[] {
  const errors: string[] = [];
  if (!normalizeBackupName(input.name)) errors.push("Backup name is required.");
  if (input.name.trim().length > 120) errors.push("Backup name must be 120 characters or fewer.");
  if (input.openingBalance !== undefined && (!Number.isFinite(input.openingBalance) || input.openingBalance < 0)) {
    errors.push("Opening balance must be a non-negative number.");
  }
  return errors;
}

export function filterBackups(records: BackupRecord[], search: string): BackupRecord[] {
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
