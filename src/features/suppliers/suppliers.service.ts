// FILE 362: src/features/suppliers/suppliers.service.ts
import type { SupplierInput, SupplierRecord } from "./suppliers.types";
import { validateSupplier } from "./suppliers.utils";

/**
 * Local module adapter placeholder.
 * Replace this in the integration phase with Tauri commands backed by SQLite.
 * Financial records must be reversed/voided with an audit event, not hard-deleted.
 */
const records: SupplierRecord[] = [];

export async function listSuppliers(): Promise<SupplierRecord[]> {
  return [...records];
}

export async function createSupplier(input: SupplierInput): Promise<SupplierRecord> {
  const errors = validateSupplier(input);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const record: SupplierRecord = {
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
