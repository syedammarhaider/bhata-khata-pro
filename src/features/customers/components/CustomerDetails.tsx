// ============================================================
// FILE 329
// PATH: src/features/customers/components/CustomerDetails.tsx
// ============================================================

import type { Customer } from "../customers.types";
import CustomerBalanceBadge from "./CustomerBalanceBadge";

export default function CustomerDetails({ customer }: { customer: Customer }) {
  const fields = [
    ["Customer Code", customer.customerCode],
    ["Name", customer.name],
    ["Phone", customer.phone],
    ["Alternate Phone", customer.alternatePhone || "—"],
    ["Address", customer.address || "—"],
    ["City", customer.city || "—"],
    ["Opening Balance", `PKR ${customer.openingBalance.toLocaleString()}`],
    ["Credit Limit", `PKR ${customer.creditLimit.toLocaleString()}`],
    ["Created", new Date(customer.createdAt).toLocaleDateString()],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
        <span className="text-sm text-slate-500">Current Account Balance</span>
        <CustomerBalanceBadge balance={customer.currentBalance} />
      </div>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-lg border p-3 dark:border-slate-800">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="mt-1 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      {customer.notes && <p className="text-sm text-slate-600">{customer.notes}</p>}
    </div>
  );
}
