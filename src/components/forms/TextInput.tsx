import type { InputHTMLAttributes } from "react";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export default function TextInput({
  value,
  onChange,
  label,
  error,
  hint,
  className = "",
  containerClassName = "",
  required,
  ...inputProps
}: TextInputProps) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <input
        {...inputProps}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
          error
            ? "border-rose-400 focus:ring-2 focus:ring-rose-500/10"
            : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700"
        } ${className}`}
      />

      {error ? (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
