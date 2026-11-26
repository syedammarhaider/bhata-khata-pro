// ============================================================
// FILE 354
// PATH: src/features/customers/components/CustomerLedgerTypeBadge.tsx
// ============================================================

import type { CustomerTransactionType } from "../customers.types";
import { CUSTOMER_TRANSACTION_LABELS } from "../customers.constants";

const styles: Record<CustomerTransactionType, string> = {
  sale: "bg-indigo-100 text-indigo-700",
  payment: "bg-emerald-100 text-emerald-700",
  return: "bg-amber-100 text-amber-700",
  adjustment: "bg-slate-100 text-slate-700",
};

export default function CustomerLedgerTypeBadge({
  type,
}: {
  type: CustomerTransactionType;
}) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[type]}`}>
      {CUSTOMER_TRANSACTION_LABELS[type]}
    </span>
  );
}
