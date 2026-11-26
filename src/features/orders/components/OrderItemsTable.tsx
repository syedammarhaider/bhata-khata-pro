// ============================================================
// FILE 212
// PATH: src/features/orders/components/OrderItemsTable.tsx
// ============================================================

import type { OrderItem } from "../orders.types";

export function OrderItemsTable({ items }: { items: OrderItem[] }) {
  return (
    <table className="mt-4 w-full text-sm">
      <thead>
        <tr>
          <th className="text-left">Item</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id} className="border-t">
            <td>
              {i.productName} ({i.grade})
            </td>
            <td className="text-center">{i.quantity}</td>
            <td className="text-right">{i.unitPrice}</td>
            <td className="text-right">{i.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
