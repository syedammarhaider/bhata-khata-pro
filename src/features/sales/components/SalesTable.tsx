// ============================================================
// Bhatta Khata Pro - Sales Table
// Clear status colors, cancelled strikethrough, print invoice
// ============================================================

import { CreditCard, RotateCcw, Ban, Pencil, Printer } from "lucide-react";
import type { SaleRecord } from "../sales.types";
import { formatSalesAmount } from "../sales.utils";
import SalesStatusBadge from "./SalesStatusBadge";
import SalesPaymentBadge from "./SalesPaymentBadge";

interface SalesTableProps {
  sales: SaleRecord[];
  onPayment?: (sale: SaleRecord) => void;
  onReturn?: (sale: SaleRecord) => void;
  onCancel?: (sale: SaleRecord) => void;
  onEdit?: (sale: SaleRecord) => void;
  onPrint?: (sale: SaleRecord) => void;
}

export default function SalesTable({
  sales,
  onPayment,
  onReturn,
  onCancel,
  onEdit,
  onPrint,
}: SalesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/80">
          <tr className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="p-3.5">Invoice #</th>
            <th className="p-3.5">Customer Name</th>
            <th className="p-3.5">Sale Date</th>
            <th className="p-3.5">Grand Total</th>
            <th className="p-3.5">Paid Amount</th>
            <th className="p-3.5">Balance Due</th>
            <th className="p-3.5">Payment</th>
            <th className="p-3.5">Sale Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sales.map((sale) => {
            const isCancelled = sale.status === "cancelled";

            return (
              <tr
                key={sale.id}
                className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                  isCancelled
                    ? "opacity-50 line-through bg-rose-50/20 text-slate-400 dark:bg-rose-950/10"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  {sale.invoiceNumber}
                </td>

                <td className="p-3.5 font-medium">
                  {sale.customerName}
                  {sale.customerPhone && (
                    <span className="block text-xs text-slate-400 not-italic no-underline">
                      {sale.customerPhone}
                    </span>
                  )}
                </td>

                <td className="p-3.5 whitespace-nowrap">{sale.saleDate}</td>

                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  PKR {formatSalesAmount(sale.grandTotal)}
                </td>

                <td className="p-3.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  PKR {formatSalesAmount(sale.paidAmount)}
                </td>

                <td className="p-3.5 font-semibold text-rose-700 dark:text-rose-400">
                  PKR {formatSalesAmount(sale.dueAmount)}
                </td>

                <td className="p-3.5 not-italic no-underline">
                  <SalesPaymentBadge status={sale.paymentStatus} />
                </td>

                <td className="p-3.5 not-italic no-underline">
                  <SalesStatusBadge status={sale.status} />
                </td>

                <td className="p-3.5 text-right not-italic no-underline">
                  <div className="flex justify-end items-center gap-1">
                    {onPrint && (
                      <button
                        type="button"
                        onClick={() => onPrint(sale)}
                        title="Print official sales invoice"
                        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Printer size={16} />
                      </button>
                    )}

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(sale)}
                        disabled={sale.paidAmount > 0 || isCancelled}
                        title="Edit unpaid sale"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-25 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Pencil size={16} />
                      </button>
                    )}

                    {onPayment && (
                      <button
                        type="button"
                        onClick={() => onPayment(sale)}
                        disabled={sale.dueAmount <= 0 || isCancelled}
                        title="Receive customer payment"
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 disabled:opacity-25 dark:text-indigo-400 dark:hover:bg-indigo-950"
                      >
                        <CreditCard size={16} />
                      </button>
                    )}

                    {onReturn && (
                      <button
                        type="button"
                        onClick={() => onReturn(sale)}
                        disabled={isCancelled}
                        title="Record brick return"
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 disabled:opacity-25 dark:text-amber-400 dark:hover:bg-amber-950"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}

                    {onCancel && !isCancelled && (
                      <button
                        type="button"
                        onClick={() => onCancel(sale)}
                        title="Cancel sale invoice"
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
