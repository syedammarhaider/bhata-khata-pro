// ============================================================
// FILE 107
// PATH: E:\BRICKSCS\src\features\dashboard\components\DashboardPermissionNotice.tsx
// ============================================================

import { LockKeyhole, ShieldCheck } from "lucide-react";

interface DashboardPermissionNoticeProps {
  title?: string;
  description?: string;
  restricted?: boolean;
}

export default function DashboardPermissionNotice({
  title = "Restricted dashboard information",
  description = "Your account does not currently have permission to view this information. Contact your kiln administrator if you need access.",
  restricted = true,
}: DashboardPermissionNoticeProps) {
  if (!restricted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <ShieldCheck size={20} className="text-emerald-600" />

        <span className="text-sm text-emerald-800 dark:text-emerald-300">
          You have permission to view this dashboard information.
        </span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
    >
      <LockKeyhole
        size={20}
        className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400"
      />

      <div>
        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-400">
          {description}
        </p>
      </div>
    </div>
  );
}
