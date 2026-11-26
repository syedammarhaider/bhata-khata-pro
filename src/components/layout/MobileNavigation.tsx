import type { ReactNode } from "react";
import { X } from "lucide-react";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: "left" | "right";
}

export default function MobileNavigation({
  open,
  onClose,
  children,
  title = "Navigation",
  side = "left",
}: MobileNavigationProps) {
  if (!open) return null;

  const position =
    side === "left" ? "left-0" : "right-0";

  const animation =
    side === "left" ? "animate-in slide-in-from-left" : "animate-in slide-in-from-right";

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute ${position} top-0 flex h-full w-[min(85vw,320px)] flex-col bg-white shadow-2xl dark:bg-slate-900 ${animation}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={19} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
}
