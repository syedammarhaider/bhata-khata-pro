// ============================================================
// FILE 105
// PATH: E:\BRICKSCS\src\features\dashboard\components\DashboardDataState.tsx
// ============================================================

import {
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
} from "lucide-react";

export type DashboardConnectionStatus =
  | "loading"
  | "connected"
  | "disconnected"
  | "error";

interface DashboardDataStateProps {
  status: DashboardConnectionStatus;
  message?: string;
  onRetry?: () => void;
}

export default function DashboardDataState({
  status,
  message,
  onRetry,
}: DashboardDataStateProps) {
  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <RefreshCw size={18} className="animate-spin text-indigo-500" />
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {message ?? "Loading dashboard information..."}
        </span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <CheckCircle2 size={18} className="text-emerald-600" />
        <span className="text-sm text-emerald-800 dark:text-emerald-300">
          {message ?? "Dashboard data connection is available."}
        </span>
      </div>
    );
  }

  const isError = status === "error";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
      <div className="flex items-center gap-3">
        {isError ? (
          <AlertCircle size={19} className="text-rose-600" />
        ) : (
          <Database size={19} className="text-amber-600" />
        )}

        <span className="text-sm text-slate-700 dark:text-slate-300">
          {message ??
            (isError
              ? "Unable to load dashboard data."
              : "Dashboard data is not connected yet.")}
        </span>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
