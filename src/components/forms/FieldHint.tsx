import type { ReactNode } from "react";
import { Info } from "lucide-react";

interface FieldHintProps {
  children: ReactNode;
  icon?: boolean;
  className?: string;
}

export default function FieldHint({
  children,
  icon = true,
  className = "",
}: FieldHintProps) {
  return (
    <p
      className={`mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400 ${className}`}
    >
      {icon && <Info size={14} className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </p>
  );
}
