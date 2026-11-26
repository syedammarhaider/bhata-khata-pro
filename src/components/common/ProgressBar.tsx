
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "amber" | "red" | "violet";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  amber: "bg-amber-500",
  red: "bg-red-600",
  violet: "bg-violet-600",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "blue",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? value : 0;
  const percentage = Math.min(
    100,
    Math.max(0, (safeValue / safeMax) * 100),
  );

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}

          {showPercentage && (
            <span className="text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || "Progress"}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
