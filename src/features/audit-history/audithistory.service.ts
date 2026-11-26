// FILE 533: src/features/audit-history/audithistory.service.ts
import type { AuditEventInput, AuditEventRecord } from "./audithistory.types";
import { validateAuditEvent } from "./audithistory.utils";

/**
 * Local module adapter placeholder.
 * Replace this in the integration phase with Tauri commands backed by SQLite.
 * Financial records must be reversed/voided with an audit event, not hard-deleted.
 */
const records: AuditEventRecord[] = [];

export async function listAuditEvents(): Promise<AuditEventRecord[]> {
  return [...records];
}

export async function createAuditEvent(input: AuditEventInput): Promise<AuditEventRecord> {
  const errors = validateAuditEvent(input);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const record: AuditEventRecord = {
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
