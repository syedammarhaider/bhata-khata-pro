// FILE 359: src/features/suppliers/suppliers.types.ts
export type SupplierStatus = "active" | "inactive" | "archived";
export interface SupplierRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
}
export interface SupplierFilters {
  search: string;
  status: "all" | SupplierStatus;
}
export interface SupplierInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
}
export interface SupplierLedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}
