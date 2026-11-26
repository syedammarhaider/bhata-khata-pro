
import type { ReactNode } from "react";
import { AlertCircle, Info } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
}

export default function FormField({
  label,
  htmlFor,
  children,
  required = false,
  error,
  hint,
  className = "",
  labelClassName = "",
}: FormFieldProps) {
  return (
    <div className={`min-w-0 space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelClassName}`}
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p
          className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Info size={13} className="mt-0.5 shrink-0" />
          <span>{hint}</span>
        </p>
      ) : null}
    </div>
  );
}
