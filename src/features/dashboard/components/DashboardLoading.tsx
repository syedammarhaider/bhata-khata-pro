// ============================================================
// FILE 97
// PATH: E:\BRICKSCS\src\features\dashboard\components\DashboardLoading.tsx
// ============================================================

interface DashboardLoadingProps {
  message?: string;
}

export default function DashboardLoading({
  message = "Loading dashboard...",
}: DashboardLoadingProps) {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}
