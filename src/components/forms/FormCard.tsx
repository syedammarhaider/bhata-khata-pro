import type { ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}

export default function FormCard({
  children,
  title,
  description,
  footer,
  className = "",
}: FormCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      {(title || description) && (
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          {title && (
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6">{children}</div>

      {footer && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40 sm:px-6">
          {footer}
        </div>
      )}
    </div>
  );
}
