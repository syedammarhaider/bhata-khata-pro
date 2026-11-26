import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SidebarGroupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  className?: string;
}

export default function SidebarGroup({
  title,
  children,
  defaultOpen = true,
  collapsible = true,
  className = "",
}: SidebarGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`mb-4 ${className}`}>
      <button
        type="button"
        disabled={!collapsible}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`mb-2 flex w-full items-center justify-between px-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 ${
          collapsible ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <span>{title}</span>

        {collapsible && (
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "" : "-rotate-90"}`}
          />
        )}
      </button>

      {open && (
        <div className="space-y-1">{children}</div>
      )}
    </section>
  );
}
