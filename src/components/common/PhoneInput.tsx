interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  label,
  placeholder = "03XX XXXXXXX",
  disabled = false,
  required = false,
  error,
  className = "",
}: PhoneInputProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={24}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
          error
            ? "border-rose-400 focus:ring-2 focus:ring-rose-500/10"
            : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
}
