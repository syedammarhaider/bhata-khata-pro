import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  action?: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
  className = "",
  required = false,
  action,
}: FormSectionProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
            {required && (
              <span className="ml-1 text-rose-500" aria-label="Required">
                *
              </span>
            )}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}
