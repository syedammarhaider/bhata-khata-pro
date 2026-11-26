
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export default function SelectField({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error = false,
  className = "",
  disabled,
  ...props
}: SelectFieldProps) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`h-10 w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-800 outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 dark:border-slate-700 dark:focus:border-blue-400"
        } ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
