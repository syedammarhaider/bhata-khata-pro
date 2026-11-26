
import { useState } from "react";
import { UserRound } from "lucide-react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "?";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = Boolean(src) && !imageFailed;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 ${sizeClasses[size]} ${className}`}
      title={name}
      aria-label={name || "User"}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : name.trim() ? (
        getInitials(name)
      ) : (
        <UserRound size={18} />
      )}
    </div>
  );
}
