// FILE 459: src/features/labour/labour.types.ts
export type WorkerStatus = "active" | "inactive" | "archived";
export interface WorkerRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: WorkerStatus;
  createdAt: string;
  updatedAt: string;
}
export interface WorkerFilters {
  search: string;
  status: "all" | WorkerStatus;
}
export interface WorkerInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
}
export interface WorkerLedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}
