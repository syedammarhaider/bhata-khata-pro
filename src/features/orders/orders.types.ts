// ============================================================
// FILE 199
// PATH: src/features/orders/orders.types.ts
// ============================================================

export type OrderStatus = "draft" | "pending" | "confirmed" | "processing" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  productName: string;
  grade: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  notes?: string;
  createdAt: string;
}

export interface OrderFormData {
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate?: string;
  items: OrderItem[];
  discount: number;
  notes?: string;
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | "all";
  fromDate: string;
  toDate: string;
}
