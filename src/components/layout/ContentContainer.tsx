import type { ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode;
  maxWidth?: "full" | "large" | "medium" | "small";
  className?: string;
}

const widthClasses = {
  full: "max-w-none",
  large: "max-w-7xl",
  medium: "max-w-5xl",
  small: "max-w-3xl",
};

export default function ContentContainer({
  children,
  maxWidth = "full",
  className = "",
}: ContentContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${widthClasses[maxWidth]} ${className}`}
    >
      {children}
    </div>
  );
}
