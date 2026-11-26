
import type { InputHTMLAttributes } from "react";

interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export default function CheckboxField({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
  ...props
}: CheckboxFieldProps) {
  return (
    <label
      className={`flex items-start gap-3 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600"
        {...props}
      />

      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
