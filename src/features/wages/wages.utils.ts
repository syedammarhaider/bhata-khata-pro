// FILE 510: src/features/wages/wages.utils.ts
import type { WageInput, WageRecord } from "./wages.types";

export function normalizeWageName(value: string): string {
  return value.trim().replace(/\\s+/g, " ");
}

export function validateWage(input: WageInput): string[] {
  const errors: string[] = [];
  if (!normalizeWageName(input.name)) errors.push("Wage name is required.");
  if (input.name.trim().length > 120) errors.push("Wage name must be 120 characters or fewer.");
  if (input.openingBalance !== undefined && (!Number.isFinite(input.openingBalance) || input.openingBalance < 0)) {
    errors.push("Opening balance must be a non-negative number.");
  }
  return errors;
}

export function filterWages(records: WageRecord[], search: string): WageRecord[] {
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
