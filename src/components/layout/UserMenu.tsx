import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

interface UserMenuProps {
  name: string;
  role?: string;
  email?: string;
  avatarUrl?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout: () => void;
  className?: string;
}

export default function UserMenu({
  name,
  role = "User",
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onLogout,
  className = "",
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const runAction = (action?: () => void) => {
    setOpen(false);
    action?.();
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {initials || "U"}
          </span>
        )}

        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-32 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {name}
          </span>
          <span className="block text-xs capitalize text-slate-500 dark:text-slate-400">
            {role}
          </span>
        </span>

        <ChevronDown
          size={15}
          className="hidden text-slate-400 sm:block"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {name}
            </p>
            {email && (
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {email}
              </p>
            )}
            <p className="mt-1 text-xs capitalize text-indigo-600 dark:text-indigo-400">
              {role}
            </p>
          </div>

          <div className="p-1.5">
            {onProfile && (
              <button
                type="button"
                role="menuitem"
                onClick={() => runAction(onProfile)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <UserRound size={16} />
                My profile
              </button>
            )}

            {onSettings && (
              <button
                type="button"
                role="menuitem"
                onClick={() => runAction(onSettings)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings size={16} />
                Account settings
              </button>
            )}

            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

            <button
              type="button"
              role="menuitem"
              onClick={() => runAction(onLogout)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
