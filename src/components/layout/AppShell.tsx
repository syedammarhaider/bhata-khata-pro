import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  topbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function AppShell({
  children,
  sidebar,
  topbar,
  footer,
  className = "",
}: AppShellProps) {
  return (
    <div
      className={`flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 ${className}`}
    >
      {sidebar && (
        <aside className="hidden shrink-0 lg:block">
          {sidebar}
        </aside>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {topbar && (
          <header className="sticky top-0 z-30 shrink-0">
            {topbar}
          </header>
        )}

        <main className="min-w-0 flex-1">{children}</main>

        {footer && (
          <footer className="shrink-0">{footer}</footer>
        )}
      </div>
    </div>
  );
}
