import type { TextareaHTMLAttributes } from "react";
import { MapPin } from "lucide-react";

interface AddressFieldProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  rows?: number;
  className?: string;
}

export default function AddressField({
  value,
  onChange,
  label = "Address",
  error,
  rows = 3,
  className = "",
  required,
  ...textareaProps
}: AddressFieldProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        <MapPin size={15} className="text-slate-400" />
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>

      <textarea
        {...textareaProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
          error
            ? "border-rose-400"
            : "border-slate-200 focus:border-indigo-500 dark:border-slate-700"
        }`}
      />

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
