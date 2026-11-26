
import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "danger";

interface InlineAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const alertStyles: Record<AlertVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",
  danger: "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300",
};

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
};

export default function InlineAlert({
  variant = "info",
  title,
  children,
  onDismiss,
  className = "",
}: InlineAlertProps) {
  const Icon = iconMap[variant];

  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border p-3.5 ${alertStyles[variant]} ${className}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />

      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <div className={`text-sm leading-6 ${title ? "mt-1" : ""}`}>
          {children}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 rounded p-1 opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
