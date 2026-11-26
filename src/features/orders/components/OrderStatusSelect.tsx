// ============================================================
// FILE 223
// PATH: src/features/orders/components/OrderStatusSelect.tsx
// ============================================================

import type { OrderStatus } from "../orders.types";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../orders.constants";

export function OrderStatusSelect({
  value,
  onChange,
}: {
  value: OrderStatus;
  onChange: (v: OrderStatus) => void;
}) {
  return (
    <select
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
