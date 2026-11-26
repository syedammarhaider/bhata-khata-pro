// ============================================================
// Bhatta Khata Pro - Order Table
// View, Cancel, Print ONLY (Delete removed).
// Cancelled orders show full row dim and strikethrough.
// ============================================================

import { Printer, Eye, Ban } from "lucide-react";
import type { Order } from "../orders.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderTable({
  orders,
  onView,
  onStatusChange,
  onPrint,
}: {
  orders: Order[];
  onView: (o: Order) => void;
  onStatusChange?: (id: string, status: string) => void;
  onPrint?: (o: Order) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="p-3.5">Order #</th>
            <th className="p-3.5">Customer</th>
            <th className="p-3.5">Order Date</th>
            <th className="p-3.5">Delivery Date</th>
            <th className="p-3.5">Total Amount</th>
            <th className="p-3.5">Paid Advance</th>
            <th className="p-3.5">Order Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {orders.map((o) => {
            const isCancelled = o.status === "cancelled";

            return (
              <tr
                key={o.id}
                className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                  isCancelled
                    ? "opacity-50 line-through bg-rose-50/20 text-slate-400 dark:bg-rose-950/10"
                    : ""
                }`}
              >
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  {o.orderNumber}
                </td>
                <td className="p-3.5 font-medium">{o.customerName}</td>
                <td className="p-3.5 whitespace-nowrap">{o.orderDate}</td>
                <td className="p-3.5 whitespace-nowrap">{o.deliveryDate || "—"}</td>
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  PKR {o.total.toLocaleString()}
                </td>
                <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  PKR {o.paidAmount.toLocaleString()}
                </td>
                <td className="p-3.5 not-italic no-underline">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="p-3.5 text-right not-italic no-underline">
                  <div className="flex items-center justify-end gap-1">
                    {onPrint && (
                      <button
                        type="button"
                        onClick={() => onPrint(o)}
                        title="Print order sheet"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Printer size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onView(o)}
                      title="View order details"
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    {onStatusChange && !isCancelled && o.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Cancel order ${o.orderNumber}?`)) {
                            onStatusChange(o.id, "cancelled");
                          }
                        }}
                        title="Cancel this order"
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
                      >
                        <Ban size={14} />
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!orders.length && (
        <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No customer orders found.
        </p>
      )}
    </div>
  );
}
