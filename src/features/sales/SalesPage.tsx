// ============================================================
// FILE 166
// PATH: E:\BRICKSCS\src\features\sales\SalesPage.tsx
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Plus } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { printRecord } from "../../lib/print";

import type {
  SaleRecord,
  SalesCustomer,
  SalesFormData,
  SalesPaymentRecord,
  SalesReturnFormData,
  SalesReturnRecord,
} from "./sales.types";

import {
  calculateSalesSummary,
  filterSales,
} from "./sales.utils";

import SalesSummaryCards from "./components/SalesSummaryCards";
import SalesTable from "./components/SalesTable";
import SalesForm from "./components/SalesForm";
import SalesFilters from "./components/SalesFilters";
import SalesEmptyState from "./components/SalesEmptyState";
import SalesPaymentForm from "./components/SalesPaymentForm";
import SalesPaymentHistory from "./components/SalesPaymentHistory";
import SalesReturnForm from "./components/SalesReturnForm";
import SalesReturnTable from "./components/SalesReturnTable";

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [payments, setPayments] = useState<SalesPaymentRecord[]>([]);
  const [returns, setReturns] = useState<SalesReturnRecord[]>([]);

  const [customers, setCustomers] = useState<SalesCustomer[]>([]);
  const [error, setError] = useState("");
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);
  const [paymentSale, setPaymentSale] = useState<SaleRecord | null>(null);
  const [returnSale, setReturnSale] = useState<SaleRecord | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentStatus: "all",
    startDate: "",
    endDate: "",
  });

  async function loadSales() {
    setError("");
    try {
      const [saleRecords, paymentRecords, returnRecords, customerRecords] = await Promise.all([
        invoke<any[]>("get_sales"),
        invoke<any[]>("get_sale_payments"),
        invoke<any[]>("get_sale_returns"),
        invoke<any[]>("get_customers"),
      ]);
      setCustomers(customerRecords
        .filter((customer) => customer.status === "active")
        .map((customer) => ({
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        })));
      setSales(saleRecords.map((sale) => ({
        id: sale.id,
        invoiceNumber: sale.invoice_number,
        customerId: sale.customer_id,
        customerName: sale.customer_name,
        customerPhone: sale.customer_phone,
        items: sale.items.map((item: any) => ({
          id: item.id,
          brickGrade: item.brick_grade,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          lineTotal: item.line_total,
        })),
        subtotal: sale.subtotal,
        discount: sale.discount,
        tax: sale.tax,
        grandTotal: sale.grand_total,
        paidAmount: sale.paid_amount,
        dueAmount: sale.due_amount,
        status: sale.status,
        paymentStatus: sale.payment_status,
        saleDate: sale.sale_date,
        notes: sale.notes,
        createdAt: sale.created_at,
      })));
      setPayments(paymentRecords.map((payment) => ({
        id: payment.id,
        saleId: payment.sale_id,
        amount: payment.amount,
        method: payment.method,
        reference: payment.reference,
        date: payment.payment_date,
        notes: payment.notes,
      })));
      setReturns(returnRecords.map((item) => ({
        id: item.id,
        saleId: item.sale_id,
        invoiceNumber: item.invoice_number,
        customerName: item.customer_name,
        brickGrade: item.brick_grade,
        quantity: item.quantity,
        reason: item.reason,
        status: item.status,
        date: item.return_date,
        creditAmount: item.credit_amount,
        creditApplied: item.credit_applied,
        creditRemaining: item.credit_remaining,
      })));
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => { void loadSales(); }, []);

  const visibleSales = useMemo(
    () => filterSales(sales, filters),
    [sales, filters],
  );

  const summary = useMemo(
    () => calculateSalesSummary(sales),
    [sales],
  );

  async function createSale(data: SalesFormData) {
    setError("");
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const grandTotal = Math.max(
      0,
      subtotal - data.discount + data.tax,
    );
    if (data.discount > subtotal) {
      setError("Discount cannot exceed the subtotal.");
      return;
    }
    try {
      const salePayload = {
          id: editingSale?.id ?? 0,
          invoice_number: editingSale?.invoiceNumber ?? "",
          customer_id: data.customerId,
          customer_name: data.customerName,
          customer_phone: data.customerPhone ?? "",
          items: data.items.map((item) => ({
            id: 0,
            brick_grade: item.brickGrade,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            line_total: item.quantity * item.unitPrice,
          })),
          subtotal,
          discount: data.discount,
          tax: data.tax,
          grand_total: grandTotal,
          paid_amount: 0,
          due_amount: grandTotal,
          status: "confirmed",
          payment_status: "unpaid",
          sale_date: data.saleDate,
          notes: data.notes ?? "",
          created_at: editingSale?.createdAt ?? "",
        };
      await invoke(editingSale ? "update_sale" : "create_sale", { sale: salePayload });
      await loadSales();
      setShowSaleForm(false);
      setEditingSale(null);
    } catch (err) {
      setError(String(err));
    }
  }

  async function recordPayment(data: Omit<SalesPaymentRecord, "id">) {
    const sale = sales.find((item) => item.id === data.saleId);
    if (!sale) return;

    if (
      !Number.isFinite(data.amount) ||
      data.amount <= 0 ||
      data.amount > sale.dueAmount
    ) {
      window.alert("Payment amount must be positive and cannot exceed the due amount.");
      return;
    }

    setError("");
    try {
      await invoke("record_sale_payment", {
        payment: {
          id: 0,
          sale_id: data.saleId,
          amount: data.amount,
          method: data.method,
          reference: data.reference ?? "",
          payment_date: data.date,
          notes: data.notes ?? "",
        },
      });
      await loadSales();
      setPaymentSale(null);
    } catch (err) {
      setError(String(err));
    }
  }

  async function recordReturn(data: SalesReturnFormData) {
    const sale = sales.find((item) => item.id === data.saleId);
    if (!sale) return;

    const soldQuantity = sale.items
      .filter((item) => item.brickGrade === data.brickGrade)
      .reduce((sum, item) => sum + item.quantity, 0);

    const alreadyReturned = returns
      .filter(
        (item) =>
          item.saleId === data.saleId &&
          item.brickGrade === data.brickGrade &&
          item.status !== "rejected",
      )
      .reduce((sum, item) => sum + item.quantity, 0);

    if (
      !Number.isSafeInteger(data.quantity) ||
      data.quantity <= 0 ||
      data.quantity + alreadyReturned > soldQuantity
    ) {
      window.alert("Return quantity exceeds the remaining sold quantity.");
      return;
    }

    setError("");
    try {
      await invoke("create_sale_return", {
        saleReturn: {
          id: 0,
          sale_id: data.saleId,
          invoice_number: sale.invoiceNumber,
          customer_name: sale.customerName,
          brick_grade: data.brickGrade,
          quantity: data.quantity,
          reason: data.reason,
          status: "approved",
          return_date: data.date,
        },
      });
      await loadSales();
      setReturnSale(null);
    } catch (err) {
      setError(String(err));
    }
  }

  async function cancelSale(sale: SaleRecord) {
    if (!window.confirm(`Cancel sale ${sale.invoiceNumber}?`)) return;
    setError("");
    try {
      await invoke("cancel_sale", { saleId: sale.id });
      await loadSales();
    } catch (err) {
      setError(String(err));
    }
  }

  function printSale(sale: SaleRecord) {
    printRecord({
      title: "Sales Invoice",
      subtitle: sale.invoiceNumber,
      sections: [
        {
          fields: [
            { label: "Invoice Number", value: sale.invoiceNumber },
            { label: "Customer", value: sale.customerName },
            { label: "Phone", value: sale.customerPhone },
            { label: "Date", value: sale.saleDate },
            { label: "Status", value: sale.status },
            { label: "Payment Status", value: sale.paymentStatus },
          ],
        },
        {
          title: "Items",
          fields: sale.items.map((item, index) => ({
            label: `${index + 1}. ${item.brickGrade} — ${item.quantity.toLocaleString()} bricks @ PKR ${item.unitPrice.toLocaleString("en-PK")}`,
            value: `PKR ${item.lineTotal.toLocaleString("en-PK")}`,
          })),
        },
        {
          title: "Totals",
          fields: [
            { label: "Subtotal", value: `PKR ${sale.subtotal.toLocaleString("en-PK")}` },
            { label: "Discount", value: `PKR ${sale.discount.toLocaleString("en-PK")}` },
            { label: "Tax", value: `PKR ${sale.tax.toLocaleString("en-PK")}` },
            { label: "Grand Total", value: `PKR ${sale.grandTotal.toLocaleString("en-PK")}` },
            { label: "Paid", value: `PKR ${sale.paidAmount.toLocaleString("en-PK")}` },
            { label: "Due", value: `PKR ${sale.dueAmount.toLocaleString("en-PK")}` },
          ],
        },
        ...(sale.notes ? [{ title: "Notes", fields: [{ label: "Notes", value: sale.notes }] }] : []),
      ],
    });
  }

  function exportSalesCsv() {
    const header = ["Invoice","Customer","Date","Total","Received","Due","Payment Status","Status"];
    const rows = visibleSales.map((sale) => [
      sale.invoiceNumber, sale.customerName, sale.saleDate, sale.grandTotal,
      sale.paidAmount, sale.dueAmount, sale.paymentStatus, sale.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-register.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Management"
        description="Create brick sales, manage invoices, record customer payments and process returns."
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => window.print()} className="rounded-lg border px-3 py-2.5 text-sm font-medium">
              Print
            </button>
            <button type="button" onClick={exportSalesCsv} className="rounded-lg border px-3 py-2.5 text-sm font-medium">
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => setShowSaleForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={17} />
              New Sale
            </button>
          </div>
        }
      />

      <SalesSummaryCards summary={summary} />

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <SalesFilters filters={filters} onChange={setFilters} />

      {visibleSales.length ? (
        <SalesTable
          sales={visibleSales}
          onPayment={setPaymentSale}
          onReturn={setReturnSale}
          onCancel={cancelSale}
          onPrint={printSale}
          onEdit={(sale) => {
            setEditingSale(sale);
            setShowSaleForm(true);
          }}
        />
      ) : (
        <SalesEmptyState
          hasRecords={sales.length > 0}
          onCreate={() => setShowSaleForm(true)}
        />
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent payment history
        </h2>
        <SalesPaymentHistory payments={payments.slice(0, 10)} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Sales returns
        </h2>
        <SalesReturnTable returns={returns} />
      </section>

      {showSaleForm && (
        <SalesForm
          customers={customers}
          onSubmit={createSale}
          initialSale={editingSale ?? undefined}
          onClose={() => {
            setShowSaleForm(false);
            setEditingSale(null);
          }}
        />
      )}

      {paymentSale && (
        <SalesPaymentForm
          sale={paymentSale}
          onSubmit={recordPayment}
          onClose={() => setPaymentSale(null)}
        />
      )}

      {returnSale && (
        <SalesReturnForm
          sale={returnSale}
          onSubmit={recordReturn}
          onClose={() => setReturnSale(null)}
        />
      )}
    </div>
  );
}
