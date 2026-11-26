// ============================================================
// FILE 205
// PATH: src/features/orders/components/OrderFilters.tsx
// ============================================================

import type { OrderFilters as Filters } from "../orders.types";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../orders.constants";

export function OrderFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        className="form-input min-w-48 flex-1"
        placeholder="Search order or customer..."
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
      />
      <select
        className="form-input"
        value={value.status}
        onChange={(e) =>
          onChange({ ...value, status: e.target.value as Filters["status"] })
        }
      >
        <option value="all">All statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <input
        type="date"
        className="form-input"
        value={value.fromDate}
        onChange={(e) => onChange({ ...value, fromDate: e.target.value })}
      />
      <input
        type="date"
        className="form-input"
        value={value.toDate}
        onChange={(e) => onChange({ ...value, toDate: e.target.value })}
      />
    </div>
  );
}
