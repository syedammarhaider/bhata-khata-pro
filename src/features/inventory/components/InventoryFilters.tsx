// ============================================================
// FILE 285
// PATH: src/features/inventory/components/InventoryFilters.tsx
// ============================================================

import SearchInput from "../../../components/common/SearchInput";
import type { StockStatus } from "../inventory.types";
import { useAppStore } from "../../../app/store";
import { translateText } from "../../../lib/i18n";

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
  const language = useAppStore((state) => state.language);
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={translateText("Search brick grade...", language)}
        />
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as StockStatus | "all")
        }
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <option value="all">{translateText("All stock statuses", language)}</option>
        <option value="in-stock">{translateText("In Stock", language)}</option>
        <option value="low-stock">{translateText("Low Stock", language)}</option>
        <option value="out-of-stock">{translateText("Out of Stock", language)}</option>
      </select>
    </div>
  );
}
