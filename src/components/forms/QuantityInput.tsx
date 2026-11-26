import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function QuantityInput({
  value,
  onChange,
  label,
  unit = "Qty",
  min = 0,
  max,
  step = 1,
  disabled = false,
  error,
  className = "",
}: QuantityInputProps) {
  const updateValue = (next: number) => {
    if (!Number.isFinite(next)) return;
    if (next < min) return;
    if (max !== undefined && next > max) return;

    onChange(Number(next.toFixed(4)));
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        className={`flex overflow-hidden rounded-lg border bg-white dark:bg-slate-900 ${
          error ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
        }`}
      >
        <button
          type="button"
          disabled={disabled || value === "" || value <= min}
          onClick={() => updateValue(Number(value) - step)}
          aria-label="Decrease quantity"
          className="flex w-10 shrink-0 items-center justify-center border-r border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Minus size={15} />
        </button>

        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const raw = event.target.value;

            if (raw === "") {
              onChange("");
              return;
            }

            const parsed = Number(raw);

            if (
              Number.isFinite(parsed) &&
              parsed >= min &&
              (max === undefined || parsed <= max)
            ) {
              onChange(parsed);
            }
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-center text-sm text-slate-900 outline-none disabled:opacity-50 dark:text-white"
        />

        <button
          type="button"
          disabled={disabled || (max !== undefined && value !== "" && value >= max)}
          onClick={() => updateValue((value === "" ? min : Number(value)) + step)}
          aria-label="Increase quantity"
          className="flex w-10 shrink-0 items-center justify-center border-l border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Plus size={15} />
        </button>

        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {unit}
        </span>
      </div>

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
