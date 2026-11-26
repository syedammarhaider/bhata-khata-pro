// FILE 508: src/features/wages/wages.types.ts
export type WageStatus = "active" | "inactive" | "archived";
export interface WageRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: WageStatus;
  createdAt: string;
  updatedAt: string;
}
export interface WageFilters {
  search: string;
  status: "all" | WageStatus;
}
export interface WageInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
}
export interface WageLedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}
