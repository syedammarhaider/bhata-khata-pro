// ============================================================
// FILE 201
// PATH: src/features/orders/orders.utils.ts
// ============================================================

import type { Order, OrderItem } from "./orders.types";

export const calculateOrderItem = (item: OrderItem): OrderItem => ({
  ...item,
  total: Math.max(0, item.quantity * item.unitPrice - item.discount),
});

export const calculateOrderTotal = (items: OrderItem[], discount = 0) =>
  Math.max(0, items.reduce((sum, item) => sum + item.total, 0) - discount);

export const getOrderBalance = (order: Order) =>
  Math.max(0, order.total - order.paidAmount);

export const getOrderProgress = (order: Order) =>
  order.total > 0 ? Math.min(100, (order.paidAmount / order.total) * 100) : 0;

export const filterOrders = (orders: Order[], search: string) => {
  const q = search.trim().toLowerCase();
  if (!q) return orders;
  return orders.filter((o) =>
    [o.orderNumber, o.customerName, o.status].some((v) =>
      v.toLowerCase().includes(q),
    ),
  );
};

export const validateOrder = (order: Partial<Order>) => {
  const errors: string[] = [];
  if (!order.customerId) errors.push("Select a customer.");
  if (!order.items?.length) errors.push("Add at least one order item.");
  if (order.items?.some((i) => i.quantity <= 0))
    errors.push("Quantity must be greater than zero.");
  if (order.items?.some((i) => i.unitPrice < 0))
    errors.push("Price cannot be negative.");
  if ((order.discount ?? 0) < 0) errors.push("Discount cannot be negative.");
  return errors;
};
