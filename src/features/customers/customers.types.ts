// ============================================================
// FILE 319
// PATH: src/features/customers/customers.types.ts
// ============================================================

export type CustomerStatus = "active" | "inactive";
export type CustomerTransactionType = "sale" | "payment" | "return" | "adjustment";

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  openingBalance: number;
  currentBalance: number;
  creditLimit: number;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  openingBalance: number;
  creditLimit: number;
  notes?: string;
}

export interface CustomerLedgerEntry {
  id: string;
  customerId: string;
  date: string;
  type: CustomerTransactionType;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CustomerFilters {
  search: string;
  status: CustomerStatus | "all";
}

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  totalReceivable: number;
  customersWithBalance: number;
}

export interface CustomerPaymentInput {
  customerId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  notes?: string;
}
