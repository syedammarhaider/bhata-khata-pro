import type { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export default function DashboardGrid({
  children,
  columns = 3,
  gap = "md",
  className = "",
}: DashboardGridProps) {
  return (
    <div
      className={[
        "grid w-full min-w-0",
        columnClasses[columns],
        gapClasses[gap],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
