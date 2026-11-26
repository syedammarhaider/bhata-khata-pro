
import type { TextareaHTMLAttributes } from "react";

interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  autoResize?: boolean;
}

export default function TextAreaField({
  value,
  onChange,
  error = false,
  autoResize = false,
  rows = 4,
  className = "",
  disabled,
  ...props
}: TextAreaFieldProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => {
        onChange(event.target.value);

        if (autoResize) {
          const element = event.currentTarget;
          element.style.height = "auto";
          element.style.height = `${element.scrollHeight}px`;
        }
      }}
      rows={rows}
      disabled={disabled}
      className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100 ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 dark:border-slate-700 dark:focus:border-blue-400"
      } ${className}`}
      {...props}
    />
  );
}
