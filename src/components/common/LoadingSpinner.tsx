
import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

export default function LoadingSpinner({
  label = "Loading...",
  fullScreen = false,
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        className={`animate-spin text-blue-600 dark:text-blue-400 ${sizeClasses[size]}`}
        strokeWidth={2}
      />

      {label && (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-950/90">
        {content}
      </div>
    );
  }

  return content;
}
