interface DateTimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  error?: string;
  className?: string;
}

export default function DateTimeField({
  value,
  onChange,
  label = "Date and time",
  required = false,
  disabled = false,
  min,
  max,
  error,
  className = "",
}: DateTimeFieldProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <input
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
          error
            ? "border-rose-400"
            : "border-slate-200 focus:border-indigo-500 dark:border-slate-700"
        }`}
      />

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
