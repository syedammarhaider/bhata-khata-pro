// ============================================================
// Bhatta Khata Pro - Order Form
// Supports customer selection/creation, brick grades, totals
// ============================================================

import { useState, useEffect, type FormEvent } from "react";
import { X, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import type { Order, OrderItem } from "../orders.types";

export function OrderForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (o: Order) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: crypto.randomUUID(),
      productName: "First Class Bricks",
      grade: "First Class",
      quantity: 5000,
      unitPrice: 14,
      discount: 0,
      total: 70000,
    },
  ]);
  const [discount, setDiscount] = useState(0);
  const [paidAdvance, setPaidAdvance] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [gradeOptions, setGradeOptions] = useState<any[]>([]);

  useEffect(() => {
    invoke<any[]>("get_customers")
      .then((res) => setCustomerOptions(res.filter((c) => c.status === "active")))
      .catch(() => {});
    invoke<any[]>("get_brick_grades")
      .then((res) => {
        const active = res.filter((g) => g.is_active);
        setGradeOptions(active);
        if (active.length > 0 && items.length === 1 && items[0].grade === "First Class") {
          const g = active[0];
          setItems([
            {
              id: crypto.randomUUID(),
              productName: g.name,
              grade: g.name,
              quantity: 5000,
              unitPrice: g.selling_price > 100 ? g.selling_price / 1000 : g.selling_price,
              discount: 0,
              total: 5000 * (g.selling_price > 100 ? g.selling_price / 1000 : g.selling_price),
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const addItem = () => {
    const defaultGrade = gradeOptions.length > 0 ? gradeOptions[0].name : "First Class";
    const defaultRate =
      gradeOptions.length > 0
        ? gradeOptions[0].selling_price > 100
          ? gradeOptions[0].selling_price / 1000
          : gradeOptions[0].selling_price
        : 14;

    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        productName: defaultGrade,
        grade: defaultGrade,
        quantity: 1000,
        unitPrice: defaultRate,
        discount: 0,
        total: 1000 * defaultRate,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, key: keyof OrderItem, val: any) => {
    setItems(
      items.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, [key]: val };
        if (key === "grade") {
          updated.productName = val;
          const found = gradeOptions.find((g) => g.name === val);
          if (found) {
            updated.unitPrice =
              found.selling_price > 100 ? found.selling_price / 1000 : found.selling_price;
          }
        }
        updated.total = Math.max(0, updated.quantity * updated.unitPrice - (updated.discount || 0));
        return updated;
      }),
    );
  };

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (items.length === 0) {
      setError("At least one brick item is required.");
      return;
    }

    const orderDate = new Date().toISOString().slice(0, 10);
    const orderNum = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedCust = customerOptions.find((c) => c.name === customerName.trim());
    const customerId = selectedCust ? String(selectedCust.id) : "0";

    onSave({
      id: "0",
      orderNumber: orderNum,
      customerId,
      customerName: customerName.trim(),
      orderDate,
      deliveryDate: deliveryDate || undefined,
      status: "pending",
      items,
      subtotal,
      discount,
      total: grandTotal,
      paidAmount: paidAdvance,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Customer Order
            </h2>
            <p className="text-xs text-slate-500">Record customer advance booking and delivery target</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Customer Name
              </label>
              <input
                required
                list="customer-list-options"
                placeholder="Select or enter customer..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <datalist id="customer-list-options">
                {customerOptions.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Ordered Brick Items
              </span>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">
                      Brick Grade
                    </label>
                    <select
                      value={item.grade}
                      onChange={(e) => updateItem(item.id, "grade", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {gradeOptions.length > 0 ? (
                        gradeOptions.map((g) => (
                          <option key={g.id || g.name} value={g.name}>
                            {g.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="First Class">First Class</option>
                          <option value="Second Class">Second Class</option>
                          <option value="A Grade">A Grade</option>
                          <option value="Seconds">Seconds</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">
                      Quantity (Bricks)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="col-span-5 sm:col-span-3">
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">
                      Rate / Brick (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="col-span-1 flex items-end justify-center pb-1">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals & Advance */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Discount (PKR)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Advance Paid (PKR)
              </label>
              <input
                type="number"
                min="0"
                value={paidAdvance}
                onChange={(e) => setPaidAdvance(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-emerald-600 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
              <span className="block text-xs text-slate-500">Grand Total</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                PKR {grandTotal.toLocaleString()}
              </span>
              <span className="block text-[11px] text-rose-500">
                Due: PKR {Math.max(0, grandTotal - paidAdvance).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Delivery Notes / Destination
            </label>
            <input
              placeholder="e.g. Near Canal bridge site, delivery vehicle required..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            <CheckCircle2 size={16} />
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}
