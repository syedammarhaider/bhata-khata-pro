
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-3.5 w-3.5",
    translate: "translate-x-4",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-4 w-4",
    translate: "translate-x-5",
  },
};

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
}: ToggleSwitchProps) {
  const styles = sizeClasses[size];

  return (
    <label
      className={`inline-flex items-center gap-3 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || "Toggle setting"}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed dark:focus-visible:ring-offset-slate-900 ${
          styles.track
        } ${
          checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block rounded-full bg-white shadow-sm transition-transform ${styles.thumb} ${
            checked ? styles.translate : "translate-x-0.5"
          }`}
        />
      </button>

      {(label || description) && (
        <span className="min-w-0">
          {label && (
            <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}

          {description && (
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
