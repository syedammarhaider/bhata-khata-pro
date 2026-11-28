
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAppStore } from "../../app/store";
import { translateText } from "../../lib/i18n";

interface PaginationProps {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export default function Pagination({
  page,
  pageSize,
  totalItems,
  currentPage: currentPageProp,
  totalPages: totalPagesProp,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = "",
}: PaginationProps) {
  const language = useAppStore((state) => state.language);
  const safePageSize = Math.max(1, pageSize ?? 1);
  const totalPages =
    totalPagesProp ?? Math.max(1, Math.ceil((totalItems ?? 0) / safePageSize));
  const currentPage = Math.min(
    Math.max(1, currentPageProp ?? page ?? 1),
    totalPages,
  );
  const hasItemStats = totalItems != null;

  const startItem =
    (totalItems ?? 0) === 0 ? 0 : (currentPage - 1) * safePageSize + 1;

  const endItem = Math.min(currentPage * safePageSize, totalItems ?? 0);

  const buttonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        {hasItemStats && (
          <span>
            Showing <strong className="text-slate-700 dark:text-slate-200">{startItem}–{endItem}</strong> of{" "}
            <strong className="text-slate-700 dark:text-slate-200">{totalItems}</strong>
          </span>
        )}

        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            {translateText("Rows", language)}:
            <select
              value={safePageSize}
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value));
                onPageChange(1);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label={translateText("First page", language)}
        >
          <ChevronsLeft size={15} />
        </button>

        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={translateText("Previous page", language)}
        >
          <ChevronLeft size={15} />
        </button>

        <span className="min-w-20 px-2 text-center text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={translateText("Next page", language)}
        >
          <ChevronRight size={15} />
        </button>

        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label={translateText("Last page", language)}
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
}
