import type { ReactNode } from "react";

interface NavigationItemProps {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  badge?: string | number;
  onClick: () => void;
  disabled?: boolean;
  collapsed?: boolean;
  className?: string;
}

export default function NavigationItem({
  label,
  icon,
  active = false,
  badge,
  onClick,
  disabled = false,
  collapsed = false,
  className = "",
}: NavigationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      } ${collapsed ? "justify-center" : ""} ${className}`}
    >
      {icon && (
        <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </span>
      )}

      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate text-left">
            {label}
          </span>

          {badge !== undefined && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}
