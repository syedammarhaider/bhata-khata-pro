// ============================================================
// FILE 340
// PATH: src/features/customers/components/CustomerBalanceSummary.tsx
// ============================================================

import type { Customer } from "../customers.types";

export default function CustomerBalanceSummary({
  customer,
}: {
  customer: Customer;
}) {
  const balance = customer.currentBalance;

  return (
    <div className="rounded-xl border p-4 dark:border-slate-800">
      <p className="text-sm text-slate-500">Account Balance</p>
      <p className="mt-2 text-2xl font-semibold">
        PKR {Math.abs(balance).toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {balance > 0 ? "Customer owes the business" : balance < 0 ? "Business holds customer advance" : "Account settled"}
      </p>
    </div>
  );
}
