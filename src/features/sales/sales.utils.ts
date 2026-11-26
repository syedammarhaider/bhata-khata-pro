// ============================================================
// FILE 165
// PATH: E:\BRICKSCS\src\features\sales\sales.utils.ts
// ============================================================

import type {
  SalePaymentStatus,
  SaleRecord,
  SalesItem,
  SalesSummary,
} from "./sales.types";

export function calculateSalesSubtotal(items: SalesItem[]): number {
  return items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
}

export function calculateSalesGrandTotal(
  subtotal: number,
  discount: number,
  tax: number,
): number {
  return Math.max(0, subtotal - discount + tax);
}

export function calculateSaleDue(
  grandTotal: number,
  paidAmount: number,
): number {
  return Math.max(0, grandTotal - paidAmount);
}

export function getSalePaymentStatus(
  grandTotal: number,
  paidAmount: number,
): SalePaymentStatus {
  if (paidAmount <= 0) return "unpaid";
  if (paidAmount >= grandTotal) return "paid";
  return "partial";
}

export function calculateSalesSummary(
  sales: SaleRecord[],
): SalesSummary {
  const activeSales = sales.filter(
    (sale) => sale.status !== "cancelled",
  );

  return {
    totalSales: activeSales.reduce(
      (sum, sale) => sum + sale.grandTotal,
      0,
    ),
    totalInvoices: activeSales.length,
    totalReceived: activeSales.reduce(
      (sum, sale) => sum + sale.paidAmount,
      0,
    ),
    totalDue: activeSales.reduce(
      (sum, sale) => sum + sale.dueAmount,
      0,
    ),
    totalDiscount: activeSales.reduce(
      (sum, sale) => sum + sale.discount,
      0,
    ),
    completedSales: activeSales.filter(
      (sale) => sale.status === "completed",
    ).length,
  };
}

export function filterSales(
  sales: SaleRecord[],
  filters: {
    search: string;
    status: string;
    paymentStatus: string;
    startDate: string;
    endDate: string;
  },
): SaleRecord[] {
  const search = filters.search.trim().toLowerCase();

  return sales.filter((sale) => {
    const matchesSearch =
      !search ||
      sale.invoiceNumber.toLowerCase().includes(search) ||
      sale.customerName.toLowerCase().includes(search) ||
      (sale.customerPhone ?? "").toLowerCase().includes(search);

    const matchesStatus =
      filters.status === "all" || sale.status === filters.status;

    const matchesPayment =
      filters.paymentStatus === "all" ||
      sale.paymentStatus === filters.paymentStatus;

    const matchesStart =
      !filters.startDate || sale.saleDate >= filters.startDate;

    const matchesEnd =
      !filters.endDate || sale.saleDate <= filters.endDate;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment &&
      matchesStart &&
      matchesEnd
    );
  });
}

export function formatSalesAmount(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSalesQuantity(quantity: number): string {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(quantity);
}

export function generateInvoiceNumber(id: number): string {
  return `INV-${new Date().getFullYear()}-${String(id).padStart(5, "0")}`;
}
