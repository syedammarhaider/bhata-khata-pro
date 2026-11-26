// ============================================================
// FILE 232
// PATH: src/features/orders/components/OrderPrintPreview.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderPrintPreview({ order }: { order: Order }) {
  return (
    <article className="bg-white p-6 text-black print:p-0">
      <h1 className="text-2xl font-bold">ORDER</h1>
      <p>{order.orderNumber}</p>
      <p>Customer: {order.customerName}</p>
      <p>Date: {order.orderDate}</p>
      <hr className="my-3" />
      {order.items.map((i) => (
        <p key={i.id}>
          {i.productName} ({i.grade}) — {i.quantity} × {i.unitPrice}
        </p>
      ))}
      <hr className="my-3" />
      <strong>Total: {order.total.toLocaleString()}</strong>
    </article>
  );
}
