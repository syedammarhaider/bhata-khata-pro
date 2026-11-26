
import type { InputHTMLAttributes } from "react";

interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: number | string;
  onChange: (value: number | "") => void;
  error?: boolean;
  allowDecimal?: boolean;
}

export default function NumberField({
  value,
  onChange,
  error = false,
  allowDecimal = true,
  min,
  max,
  step,
  className = "",
  ...props
}: NumberFieldProps) {
  return (
    <input
      type="number"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      value={value}
      min={min}
      max={max}
      step={step ?? (allowDecimal ? "any" : 1)}
      onChange={(event) => {
        const raw = event.target.value;

        if (raw === "") {
          onChange("");
          return;
        }

        const parsed = Number(raw);

        if (Number.isFinite(parsed)) {
          onChange(parsed);
        }
      }}
      className={`h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 dark:border-slate-700 dark:focus:border-blue-400"
      } ${className}`}
      {...props}
    />
  );
}
