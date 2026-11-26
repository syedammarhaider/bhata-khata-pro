// ============================================================
// FILE 325
// PATH: src/features/customers/components/CustomersFilters.tsx
// ============================================================

import SearchInput from "../../../components/common/SearchInput";
import type { CustomerStatus } from "../customers.types";

interface Props {
  search: string;
  status: CustomerStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CustomerStatus | "all") => void;
}

export default function CustomersFilters({
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
          placeholder="Search customer name, code, or phone..."
        />
      </div>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as CustomerStatus | "all")}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="all">All Customers</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
