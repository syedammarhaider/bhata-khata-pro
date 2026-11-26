// ============================================================
// Bhatta Khata Pro - Orders Page
// View, Cancel, Print ONLY (Delete removed)
// ============================================================

import { useMemo, useState, useEffect, useCallback } from "react";
import { ClipboardList, Plus, RefreshCw } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { OrderSummaryCards } from "./components/OrderSummaryCards";
import { OrderFilters } from "./components/OrderFilters";
import { OrderTable } from "./components/OrderTable";
import { OrderForm } from "./components/OrderForm";
import type { Order, OrderFilters as Filters } from "./orders.types";
import { DEFAULT_ORDER_FILTERS } from "./orders.constants";
import { getOrders, saveOrder, updateOrderStatus } from "../../lib/api";
import type { Order as ApiOrder } from "../../lib/api";
import { printRecord } from "../../lib/print";

function mapApiToOrder(api: ApiOrder): Order {
  return {
    id: String(api.id),
    orderNumber: api.order_number,
    customerId: String(api.customer_id),
    customerName: api.customer_name,
    orderDate: api.order_date,
    deliveryDate: api.delivery_date ?? undefined,
    status: api.status as Order["status"],
    items: api.items.map((item) => ({
      id: String(item.id),
      productName: item.brick_grade,
      grade: item.brick_grade,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      discount: 0,
      total: item.total,
    })),
    subtotal: api.subtotal,
    discount: api.discount,
    total: api.total,
    paidAmount: api.paid_amount,
    notes: api.notes,
    createdAt: api.created_at,
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_ORDER_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data.map(mapApiToOrder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const visible = useMemo(
    () =>
      orders.filter((o) => {
        const q = filters.search.toLowerCase();
        const match =
          !q ||
          `${o.orderNumber} ${o.customerName}`.toLowerCase().includes(q);
        return match && (filters.status === "all" || o.status === filters.status);
      }),
    [orders, filters],
  );

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateOrderStatus(Number(id), status);
      await fetchOrders();
      setSuccessMsg(`Order updated to ${status}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    }
  }

  function handlePrintOrder(order: Order) {
    printRecord({
      title: "Customer Order & Delivery Voucher",
      subtitle: `Order #: ${order.orderNumber}`,
      sections: [
        {
          title: "Order Information",
          fields: [
            { label: "Order Number", value: order.orderNumber },
            { label: "Customer Name", value: order.customerName },
            { label: "Booking Date", value: order.orderDate },
            { label: "Committed Delivery", value: order.deliveryDate || "As per dispatch queue" },
            { label: "Status", value: order.status.toUpperCase() },
            { label: "Notes / Destination", value: order.notes || "—" },
          ],
        },
        {
          title: "Ordered Brick Grade & Quantities",
          fields: order.items.map((item, index) => ({
            label: `${index + 1}. ${item.grade} (${item.quantity.toLocaleString()} Bricks @ PKR ${item.unitPrice.toLocaleString("en-PK")})`,
            value: `PKR ${item.total.toLocaleString("en-PK")}`,
          })),
        },
        {
          title: "Payment Summary",
          fields: [
            { label: "Subtotal", value: `PKR ${order.subtotal.toLocaleString("en-PK")}` },
            { label: "Discount", value: `PKR ${order.discount.toLocaleString("en-PK")}` },
            { label: "Net Payable", value: `PKR ${order.total.toLocaleString("en-PK")}` },
            { label: "Advance Paid", value: `PKR ${order.paidAmount.toLocaleString("en-PK")}` },
            {
              label: "Balance Due on Dispatch",
              value: `PKR ${Math.max(0, order.total - order.paidAmount).toLocaleString("en-PK")}`,
            },
          ],
        },
      ],
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage customer advance bookings, delivery schedules, and fulfillment status."
        icon={ClipboardList}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchOrders}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              onClick={() => setFormOpen(true)}
            >
              <Plus size={16} /> New Order
            </button>
          </div>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <OrderSummaryCards orders={orders} />
          <OrderFilters value={filters} onChange={setFilters} />
          <OrderTable
            orders={visible}
            onView={(order) => {
              setViewingOrder(order);
            }}
            onStatusChange={handleStatusChange}
            onPrint={handlePrintOrder}
          />
        </>
      )}

      {formOpen && (
        <OrderForm
          onClose={() => setFormOpen(false)}
          onSave={async (o) => {
            try {
              await saveOrder({
                id: 0,
                order_number: "",
                customer_id: Number(o.customerId) || 0,
                customer_name: o.customerName,
                order_date: o.orderDate,
                delivery_date: o.deliveryDate ?? null,
                status: o.status ?? "pending",
                subtotal: o.subtotal,
                discount: o.discount,
                tax: 0,
                total: o.total,
                paid_amount: o.paidAmount,
                notes: o.notes ?? "",
                created_by: "admin",
                created_at: "",
                updated_at: "",
                items: o.items.map((item) => ({
                  id: 0,
                  brick_grade: item.grade,
                  quantity: item.quantity,
                  unit_price: item.unitPrice,
                  total: item.total,
                })),
              });
              await fetchOrders();
              setFormOpen(false);
              setSuccessMsg(`Order created successfully for ${o.customerName}.`);
              setTimeout(() => setSuccessMsg(""), 4000);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to save order");
            }
          }}
        />
      )}

      {/* Quick View Dialog */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Order Details &bull; {viewingOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-500">
                  Customer: {viewingOrder.customerName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Booking Date</span>
                <span className="font-semibold">{viewingOrder.orderDate}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Target Delivery</span>
                <span className="font-semibold">{viewingOrder.deliveryDate || "—"}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Current Status</span>
                <span className="font-bold uppercase text-indigo-600">{viewingOrder.status}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Total Price</span>
                <span className="font-bold">PKR {viewingOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Advance Paid</span>
                <span className="font-bold text-emerald-600">PKR {viewingOrder.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Balance Due</span>
                <span className="font-bold text-rose-600">
                  PKR {Math.max(0, viewingOrder.total - viewingOrder.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handlePrintOrder(viewingOrder)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Print Voucher
              </button>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
