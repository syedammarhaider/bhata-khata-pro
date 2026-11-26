
import type { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  details?: ReactNode;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  details,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 px-5 py-10 text-center dark:border-red-900/50 dark:bg-red-950/10 ${className}`}
      role="alert"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <AlertCircle size={24} />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
        {message}
      </p>

      {details && (
        <div className="mt-3 max-w-full break-words text-xs text-slate-500 dark:text-slate-400">
          {details}
        </div>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <RefreshCw size={15} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
