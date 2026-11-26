import { Mail } from "lucide-react";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function EmailField({
  value,
  onChange,
  label = "Email address",
  placeholder = "example@email.com",
  required = false,
  disabled = false,
  error,
  className = "",
}: EmailFieldProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div
        className={`flex items-center rounded-lg border bg-white dark:bg-slate-900 ${
          error
            ? "border-rose-400"
            : "border-slate-200 focus-within:border-indigo-500 dark:border-slate-700"
        }`}
      >
        <Mail size={17} className="ml-3 shrink-0 text-slate-400" />

        <input
          type="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50 dark:text-white"
        />
      </div>

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
