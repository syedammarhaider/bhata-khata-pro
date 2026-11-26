// FILE 545: src/features/backup-restore/backuprestore.types.ts
export type BackupStatus = "active" | "inactive" | "archived";
export interface BackupRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: BackupStatus;
  createdAt: string;
  updatedAt: string;
}
export interface BackupFilters {
  search: string;
  status: "all" | BackupStatus;
}
export interface BackupInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
}
export interface BackupLedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}
