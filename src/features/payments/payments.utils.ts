// FILE 411: src/features/payments/payments.utils.ts
import type { PaymentInput, PaymentRecord } from "./payments.types";

export function normalizePaymentName(value: string): string {
  return value.trim().replace(/\\s+/g, " ");
}

export function validatePayment(input: PaymentInput): string[] {
  const errors: string[] = [];
  if (!normalizePaymentName(input.name)) errors.push("Payment name is required.");
  if (input.name.trim().length > 120) errors.push("Payment name must be 120 characters or fewer.");
  if (input.openingBalance !== undefined && (!Number.isFinite(input.openingBalance) || input.openingBalance < 0)) {
    errors.push("Opening balance must be a non-negative number.");
  }
  return errors;
}

export function filterPayments(records: PaymentRecord[], search: string): PaymentRecord[] {
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
