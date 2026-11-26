// ============================================================
// FILE 326
// PATH: src/features/customers/components/CustomersTable.tsx
// ============================================================

import type { Customer } from "../customers.types";
import CustomerBalanceBadge from "./CustomerBalanceBadge";
import CustomerStatusBadge from "./CustomerStatusBadge";

interface Props {
  customers: Customer[];
  onSelect?: (customer: Customer) => void;
}

export default function CustomersTable({ customers, onSelect }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-xs uppercase text-slate-500 dark:text-slate-400">
          <tr>
            <th className="p-3">Customer</th>
            <th className="p-3">Phone</th>
            <th className="p-3">City</th>
            <th className="p-3">Balance</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => onSelect?.(customer)}
              className={onSelect ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800" : ""}
            >
              <td className="p-3">
                <p className="font-medium">{customer.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{customer.customerCode}</p>
              </td>
              <td className="p-3">{customer.phone}</td>
              <td className="p-3">{customer.city || "—"}</td>
              <td className="p-3">
                <CustomerBalanceBadge balance={customer.currentBalance} />
              </td>
              <td className="p-3">
                <CustomerStatusBadge status={customer.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
