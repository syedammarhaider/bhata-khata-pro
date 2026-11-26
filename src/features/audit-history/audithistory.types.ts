// FILE 530: src/features/audit-history/audithistory.types.ts
export type AuditEventStatus = "active" | "inactive" | "archived";
export interface AuditEventRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: AuditEventStatus;
  createdAt: string;
  updatedAt: string;
}
export interface AuditEventFilters {
  search: string;
  status: "all" | AuditEventStatus;
}
export interface AuditEventInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  openingBalance?: number;
}
export interface AuditEventLedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}
