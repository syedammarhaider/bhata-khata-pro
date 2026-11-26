// ============================================================
// FILE 163
// PATH: E:\BRICKSCS\src\features\sales\sales.types.ts
// ============================================================

export type SaleStatus = "draft" | "confirmed" | "completed" | "cancelled";
export type SalePaymentStatus = "unpaid" | "partial" | "paid";
export type SalePaymentMethod = "cash" | "bank" | "online" | "cheque";
export type SaleReturnStatus = "pending" | "approved" | "rejected";

export interface SalesCustomer {
  id: number;
  name: string;
  phone?: string;
  address?: string;
}

export interface SalesItem {
  id: number;
  brickGrade: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SaleRecord {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  customerPhone?: string;
  items: SalesItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: SaleStatus;
  paymentStatus: SalePaymentStatus;
  paymentMethod?: SalePaymentMethod;
  saleDate: string;
  notes?: string;
  createdAt: string;
}

export interface SalesPaymentRecord {
  id: number;
  saleId: number;
  amount: number;
  method: SalePaymentMethod;
  reference?: string;
  date: string;
  notes?: string;
}

export interface SalesReturnRecord {
  id: number;
  saleId: number;
  invoiceNumber: string;
  customerName: string;
  brickGrade: string;
  quantity: number;
  reason: string;
  status: SaleReturnStatus;
  date: string;
  creditAmount: number;
  creditApplied: number;
  creditRemaining: number;
}

export interface SalesSummary {
  totalSales: number;
  totalInvoices: number;
  totalReceived: number;
  totalDue: number;
  totalDiscount: number;
  completedSales: number;
}

export interface SalesFilters {
  search: string;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
}

export interface SalesFormData {
  customerId: number;
  customerName: string;
  customerPhone?: string;
  items: SalesItem[];
  discount: number;
  tax: number;
  saleDate: string;
  notes?: string;
}

export interface SalesPaymentFormData {
  saleId: number;
  amount: number;
  method: SalePaymentMethod;
  reference?: string;
  date: string;
  notes?: string;
}

export interface SalesReturnFormData {
  saleId: number;
  brickGrade: string;
  quantity: number;
  reason: string;
  date: string;
}
