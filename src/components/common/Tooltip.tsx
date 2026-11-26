
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  className?: string;
}

const positionClasses = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export default function Tooltip({
  content,
  children,
  position = "top",
  disabled = false,
  className = "",
}: TooltipProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}

      <span
        role="tooltip"
        className={`pointer-events-none absolute z-[120] w-max max-w-56 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${positionClasses[position]}`}
      >
        {content}
      </span>
    </span>
  );
}
