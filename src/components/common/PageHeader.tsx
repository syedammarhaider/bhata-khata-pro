
import type { ElementType, ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { useAppStore } from "../../app/store";
import { translateTextNode } from "../../lib/i18n";

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
  const language = useAppStore((state) => state.language);
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
                  {translateTextNode(item.label, language)}
                </a>
              ) : (
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "font-medium text-slate-700 dark:text-slate-200"
                      : ""
                  }
                >
                  {translateTextNode(item.label, language)}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="app-icon-chip h-11 w-11 shrink-0">
              <Icon size={21} strokeWidth={1.8} />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="app-page-title text-xl sm:text-2xl">
              {translateTextNode(title, language)}
            </h1>

            {description && (
              <p className="app-page-description mt-1 max-w-2xl">
                {translateTextNode(description, language)}
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
