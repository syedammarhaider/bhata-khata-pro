// ============================================================
// FILE 322
// PATH: src/features/customers/customers.service.ts
// ============================================================

import type {
  CustomerInput,
  CustomerPaymentInput,
  CustomerLedgerEntry,
} from "./customers.types";

export function prepareCustomer(input: CustomerInput): CustomerInput {
  if (!input.name.trim()) {
    throw new Error("Customer name is required.");
  }

  if (!input.phone.trim()) {
    throw new Error("Customer phone number is required.");
  }

  if (!Number.isFinite(input.openingBalance)) {
    throw new Error("Opening balance must be a valid number.");
  }

  if (!Number.isFinite(input.creditLimit) || input.creditLimit < 0) {
    throw new Error("Credit limit cannot be negative.");
  }

  return {
    ...input,
    name: input.name.trim(),
    phone: input.phone.trim(),
    alternatePhone: input.alternatePhone?.trim() || undefined,
    address: input.address?.trim() || undefined,
    city: input.city?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
  };
}

export function prepareCustomerPayment(
  input: CustomerPaymentInput,
): CustomerPaymentInput {
  if (!input.customerId.trim()) {
    throw new Error("Customer is required.");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (!input.date) {
    throw new Error("Payment date is required.");
  }

  if (!input.method.trim()) {
    throw new Error("Payment method is required.");
  }

  if (!input.reference.trim()) {
    throw new Error("Payment reference is required.");
  }

  return {
    ...input,
    method: input.method.trim(),
    reference: input.reference.trim(),
    notes: input.notes?.trim() || undefined,
  };
}

export function createCustomerPaymentEntry(
  input: CustomerPaymentInput,
): Omit<CustomerLedgerEntry, "balance"> {
  const payment = prepareCustomerPayment(input);

  return {
    id: crypto.randomUUID(),
    customerId: payment.customerId,
    date: payment.date,
    type: "payment",
    reference: payment.reference,
    description: `Customer payment - ${payment.method}`,
    debit: 0,
    credit: payment.amount,
  };
}
