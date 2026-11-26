import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "small" | "medium" | "large";
}

const paddingClasses = {
  none: "",
  small: "p-3 sm:p-4",
  medium: "p-4 sm:p-6",
  large: "p-5 sm:p-8",
};

export default function MainContent({
  children,
  className = "",
  padding = "medium",
}: MainContentProps) {
  return (
    <main
      className={`min-w-0 flex-1 ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </main>
  );
}
