// ============================================================
// FILE 330
// PATH: src/features/customers/components/CustomerStatusBadge.tsx
// ============================================================

import type { CustomerStatus } from "../customers.types";

export default function CustomerStatusBadge({
  status,
}: {
  status: CustomerStatus;
}) {
  const classes =
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}
