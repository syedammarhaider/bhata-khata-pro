import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface NotificationToastProps {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}

const toastStyles: Record<
  ToastType,
  { container: string; icon: typeof CheckCircle2 }
> = {
  success: {
    container:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200",
    icon: CheckCircle2,
  },
  error: {
    container:
      "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200",
    icon: AlertCircle,
  },
  warning: {
    container:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/70 dark:text-amber-200",
    icon: AlertTriangle,
  },
  info: {
    container:
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/70 dark:text-blue-200",
    icon: Info,
  },
};

export default function NotificationToast({
  toast,
  onDismiss,
}: NotificationToastProps) {
  const style = toastStyles[toast.type];
  const Icon = style.icon;

  return (
    <div
      role="status"
      className={`flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg ${style.container}`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />

      <p className="flex-1 text-sm font-medium leading-5">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-0.5 opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </div>
  );
}
