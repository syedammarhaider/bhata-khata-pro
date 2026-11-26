import type { ReactNode } from "react";

interface KpiGridProps {
  children: ReactNode;
  className?: string;
}

export default function KpiGrid({
  children,
  className = "",
}: KpiGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}
