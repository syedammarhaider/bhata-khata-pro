import type { ReactNode } from "react";

interface FormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "small" | "medium" | "large";
  className?: string;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const gapClasses = {
  small: "gap-3",
  medium: "gap-4",
  large: "gap-6",
};

export default function FormGrid({
  children,
  columns = 2,
  gap = "medium",
  className = "",
}: FormGridProps) {
  return (
    <div
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}
