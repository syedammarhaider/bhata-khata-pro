// FILE 532: src/features/audit-history/audithistory.utils.ts
import type { AuditEventInput, AuditEventRecord } from "./audithistory.types";

export function normalizeAuditEventName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateAuditEvent(input: AuditEventInput): string[] {
  const errors: string[] = [];
  if (!normalizeAuditEventName(input.name)) errors.push("Audit Event name is required.");
  if (input.name.trim().length > 120) errors.push("Audit Event name must be 120 characters or fewer.");
  if (input.openingBalance !== undefined && (!Number.isFinite(input.openingBalance) || input.openingBalance < 0)) {
    errors.push("Opening balance must be a non-negative number.");
  }
  return errors;
}

export function filterAuditEvents(records: AuditEventRecord[], search: string): AuditEventRecord[] {
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
