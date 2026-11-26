import type { ReactNode } from "react";

interface FormDividerProps {
  label?: ReactNode;
  className?: string;
}

export default function FormDivider({
  label,
  className = "",
}: FormDividerProps) {
  if (!label) {
    return (
      <div
        role="separator"
        className={`h-px w-full bg-slate-200 dark:bg-slate-700 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
