// ============================================================
// FILE 285
// PATH: src/features/inventory/components/InventoryFilters.tsx
// ============================================================

import SearchInput from "../../../components/common/SearchInput";
import type { StockStatus } from "../inventory.types";

interface Props {
  search: string;
  status: StockStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StockStatus | "all") => void;
}

export default function InventoryFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search brick grade..."
        />
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as StockStatus | "all")
        }
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <option value="all">All stock statuses</option>
        <option value="in-stock">In Stock</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
    </div>
  );
}
