// FILE 409: src/features/payments/payments.types.ts
export type PaymentStatus = "active" | "inactive" | "archived";
export interface PaymentRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}
export interface PaymentFilters {
  search: string;
  status: "all" | PaymentStatus;
}
export interface PaymentInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
}
export interface PaymentLedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}
