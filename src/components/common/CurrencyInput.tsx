import type { ChangeEvent } from "react";

interface CurrencyInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  currency?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  className?: string;
}

export default function CurrencyInput({
  value,
  onChange,
  currency = "PKR",
  label,
  placeholder = "0.00",
  disabled = false,
  min = 0,
  max,
  step = 0.01,
  error,
  className = "",
}: CurrencyInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    if (raw === "") {
      onChange("");
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(raw)) {
      return;
    }

    const parsed = Number(raw);

    if (!Number.isFinite(parsed)) {
      return;
    }

    if (max !== undefined && parsed > max) {
      return;
    }

    onChange(parsed);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        className={`flex overflow-hidden rounded-lg border bg-white transition dark:bg-slate-900 ${
          error
            ? "border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/10"
            : "border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-slate-700"
        }`}
      >
        <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {currency}
        </span>

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          step={step}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
}
