import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Database } from "lucide-react";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string | number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export default function DataTable<T>({
  columns,
  data,
  getRowId,
  emptyMessage = "No records found.",
  onRowClick,
  loading = false,
  sortKey,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 ${
                    alignment[column.align ?? "left"]
                  } ${column.headerClassName ?? ""}`}
                >
                  {onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(String(column.key))}
                      className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {column.header}
                      {sortKey === String(column.key) &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        ))}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading records...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14">
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Database size={30} />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowId ? getRowId(row, index) : index}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((column) => {
                    const value = row[column.key as keyof T];

                    return (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 text-slate-700 dark:text-slate-200 ${
                          alignment[column.align ?? "left"]
                        } ${column.className ?? ""}`}
                      >
                        {column.render
                          ? column.render(row, index)
                          : String(value ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
