// FILE 412: src/features/payments/payments.service.ts
import type { PaymentInput, PaymentRecord } from "./payments.types";
import { validatePayment } from "./payments.utils";

/**
 * Local module adapter placeholder.
 * Replace this in the integration phase with Tauri commands backed by SQLite.
 * Financial records must be reversed/voided with an audit event, not hard-deleted.
 */
const records: PaymentRecord[] = [];

export async function listPayments(): Promise<PaymentRecord[]> {
  return [...records];
}

export async function createPayment(input: PaymentInput): Promise<PaymentRecord> {
  const errors = validatePayment(input);
  if (errors.length) throw new Error(errors.join(" "));
  const now = new Date().toISOString();
  const record: PaymentRecord = {
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
