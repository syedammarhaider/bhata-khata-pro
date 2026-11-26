import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  onNavigate?: (href: string) => void;
  className?: string;
}

export default function Breadcrumbs({
  items,
  showHome = true,
  onNavigate,
  className = "",
}: BreadcrumbsProps) {
  const renderLink = (
    item: BreadcrumbItem,
    index: number,
    isLast: boolean,
  ) => {
    const commonClass = `truncate text-sm transition ${
      isLast
        ? "font-semibold text-slate-800 dark:text-slate-100"
        : "text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
    }`;

    if (item.href || item.onClick) {
      return (
        <button
          key={`${item.label}-${index}`}
          type="button"
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            } else if (item.href) {
              onNavigate?.(item.href);
            }
          }}
          disabled={isLast}
          className={commonClass}
        >
          {item.label}
        </button>
      );
    }

    return (
      <span
        key={`${item.label}-${index}`}
        aria-current={isLast ? "page" : undefined}
        className={commonClass}
      >
        {item.label}
      </span>
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex min-w-0 items-center gap-1.5 overflow-hidden ${className}`}
    >
      {showHome && (
        <>
          <button
            type="button"
            onClick={() => onNavigate?.("/dashboard")}
            aria-label="Go to dashboard"
            className="shrink-0 text-slate-400 transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Home size={15} />
          </button>

          {items.length > 0 && (
            <ChevronRight
              size={14}
              className="shrink-0 text-slate-300 dark:text-slate-600"
            />
          )}
        </>
      )}

      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex min-w-0 items-center gap-1.5"
        >
          {renderLink(item, index, index === items.length - 1)}

          {index < items.length - 1 && (
            <ChevronRight
              size={14}
              className="shrink-0 text-slate-300 dark:text-slate-600"
            />
          )}
        </div>
      ))}
    </nav>
  );
}
