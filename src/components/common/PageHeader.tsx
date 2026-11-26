
import type { ElementType, ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ElementType;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs = [],
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-6 flex flex-col gap-4 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
        >
          <Home size={14} />

          {breadcrumbs.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              <ChevronRight size={13} />

              {item.href ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "font-medium text-slate-700 dark:text-slate-200"
                      : ""
                  }
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Icon size={21} strokeWidth={1.8} />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>

            {description && (
              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
