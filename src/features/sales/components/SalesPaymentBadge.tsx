// ============================================================
// FILE 176
// PATH: E:\BRICKSCS\src\features\sales\components\SalesPaymentBadge.tsx
// ============================================================

import type { SalePaymentStatus } from "../sales.types";

const labels: Record<SalePaymentStatus, string> = {
  unpaid: "Unpaid",
  partial: "Partially paid",
  paid: "Paid",
};

const styles: Record<SalePaymentStatus, string> = {
  unpaid: "bg-rose-50 text-rose-700",
  partial: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
};

export default function SalesPaymentBadge({ status }: { status: SalePaymentStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
}
