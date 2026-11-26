interface PercentageInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  label?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function PercentageInput({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  disabled = false,
  error,
  className = "",
}: PercentageInputProps) {
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
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step="0.01"
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
              parsed <= max
            ) {
              onChange(parsed);
            }
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none disabled:opacity-50 dark:text-white"
        />

        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          %
        </span>
      </div>

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
