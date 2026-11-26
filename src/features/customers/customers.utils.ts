// ============================================================
// FILE 321
// PATH: src/features/customers/customers.utils.ts
// ============================================================

import type {
  Customer,
  CustomerLedgerEntry,
  CustomerSummary,
  CustomerStatus,
} from "./customers.types";

export function calculateCustomerSummary(
  customers: Customer[],
): CustomerSummary {
  return {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((item) => item.status === "active").length,
    totalReceivable: customers.reduce(
      (sum, item) => sum + Math.max(0, item.currentBalance),
      0,
    ),
    customersWithBalance: customers.filter(
      (item) => item.currentBalance > 0,
    ).length,
  };
}

export function filterCustomers(
  customers: Customer[],
  search: string,
  status: CustomerStatus | "all",
): Customer[] {
  const query = search.trim().toLowerCase();

  return customers.filter((customer) => {
    const matchesSearch =
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.customerCode.toLowerCase().includes(query) ||
      customer.phone.includes(query);

    return matchesSearch &&
      (status === "all" || customer.status === status);
  });
}

export function calculateLedgerBalance(
  entries: CustomerLedgerEntry[],
  openingBalance = 0,
): CustomerLedgerEntry[] {
  let balance = openingBalance;

  return [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => {
      balance += entry.debit - entry.credit;
      return { ...entry, balance };
    });
}

export function getCustomerBalanceLabel(balance: number): string {
  if (balance > 0) return "Receivable";
  if (balance < 0) return "Advance";
  return "Settled";
}
