// FILE 361: src/features/suppliers/suppliers.utils.ts
import type { SupplierInput, SupplierRecord } from "./suppliers.types";

export function normalizeSupplierName(value: string): string {
  return value.trim().replace(/\\s+/g, " ");
}

export function validateSupplier(input: SupplierInput): string[] {
  const errors: string[] = [];
  if (!normalizeSupplierName(input.name)) errors.push("Supplier name is required.");
  if (input.name.trim().length > 120) errors.push("Supplier name must be 120 characters or fewer.");
  if (input.openingBalance !== undefined && (!Number.isFinite(input.openingBalance) || input.openingBalance < 0)) {
    errors.push("Opening balance must be a non-negative number.");
  }
  return errors;
}

export function filterSuppliers(records: SupplierRecord[], search: string): SupplierRecord[] {
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
