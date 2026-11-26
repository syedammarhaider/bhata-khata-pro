// ============================================================
// FILE 129
// PATH: E:\BRICKSCS\src\features\production\components\ProductionQuantityInput.tsx
// ============================================================

interface ProductionQuantityInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function ProductionQuantityInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100_000_000,
  disabled = false,
}: ProductionQuantityInputProps) {
  function update(raw: string) {
    if (raw === "") {
      onChange(min);
      return;
    }

    const parsed = Number(raw);

    if (!Number.isSafeInteger(parsed)) return;

    onChange(Math.min(max, Math.max(min, parsed)));
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        type="text"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        onFocus={(event) => {
          if (value === 0) event.currentTarget.select();
        }}
        onChange={(event) => {
          if (/^\d*$/.test(event.target.value)) {
            update(event.target.value);
          }
        }}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </label>
  );
}
