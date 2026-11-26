// ============================================================
// FILE 190
// PATH: E:\BRICKSCS\src\features\sales\components\SalesReturnBadge.tsx
// ============================================================

import type { SaleReturnStatus } from "../sales.types";

const styles: Record<SaleReturnStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

const labels: Record<SaleReturnStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function SalesReturnBadge({ status }: { status: SaleReturnStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
}
