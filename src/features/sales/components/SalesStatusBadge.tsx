// ============================================================
// FILE 175
// PATH: E:\BRICKSCS\src\features\sales\components\SalesStatusBadge.tsx
// ============================================================

import type { SaleStatus } from "../sales.types";

const labels: Record<SaleStatus, string> = {
  draft: "Draft",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const styles: Record<SaleStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

export default function SalesStatusBadge({ status }: { status: SaleStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
}
