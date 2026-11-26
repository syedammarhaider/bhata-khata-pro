// ============================================================
// Bhatta Khata Pro - Expenses Management
// Add Custom Expense, Cancel (Strikethrough), View, Print Voucher
// Dynamic categories loaded from Settings (Food, Personal Fuel, etc.)
// ============================================================

import { useMemo, useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  RefreshCw,
  Printer,
  Eye,
  Ban,
  CheckCircle2,
  X,
} from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import { getExpenses, saveExpense } from "../../lib/api";
import type { Expense } from "../../lib/api";
import { printRecord, printTable } from "../../lib/print";

interface ExpenseRecord {
  id: string;
  expenseNumber: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  status: "approved" | "pending" | "cancelled" | "rejected";
}

const DEFAULT_CATEGORIES = [
  "Food Expense (کھانا / خوراک)",
  "Personal Fuel (ذاتی پیٹرول / ڈیزل)",
  "Kiln Maintenance (بھٹہ مرمت و اوزار)",
  "Electricity & Generator (بجلی و جنریٹر)",
  "Labour Welfare & Tea (مزدور چائے و راشن)",
  "Transport & Freight (کرایہ و ٹرانسپورٹ)",
  "Office & Administrative (دفتری اخراجات)",
  "Government Taxes & Fees (ٹیکس و فیس)",
  "General / Miscellaneous (متفرق اخراجات)",
];

export default function ExpensesPage() {
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // New Expense Modal
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(1500);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // View Modal
  const [viewingRecord, setViewingRecord] = useState<ExpenseRecord | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [data, settings] = await Promise.all([
        getExpenses(),
        invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings").catch(
          () => [],
        ),
      ]);

      setRecords(
        data.map((e: Expense) => ({
          id: String(e.id),
          expenseNumber: e.expense_number,
          category: e.category,
          amount: e.amount,
          date: e.expense_date,
          description: e.description,
          paymentMethod: e.payment_method,
          status: (e.status || "approved") as ExpenseRecord["status"],
        })),
      );

      const catSetting = settings.find((s) => s.setting_key === "bhatta_expense_categories");
      if (catSetting && catSetting.setting_value) {
        try {
          const parsed = JSON.parse(catSetting.setting_value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        } catch {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((r) => {
      const matchSearch =
        !term ||
        [r.category, r.description, r.expenseNumber, r.paymentMethod].some((v) =>
          v.toLowerCase().includes(term),
        );
      const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [records, search, categoryFilter, statusFilter]);

  const activeRecords = records.filter((r) => r.status !== "cancelled" && r.status !== "rejected");
  const totalAmount = activeRecords.reduce((sum, r) => sum + r.amount, 0);

  async function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!amount || amount <= 0) {
      setError("Please specify a valid positive amount.");
      return;
    }

    try {
      await saveExpense({
        id: 0,
        expense_number: "",
        category,
        amount,
        expense_date: date,
        description: description.trim() || `Expense for ${category}`,
        payment_method: paymentMethod,
        status: "approved",
        created_by: "manager",
        created_at: "",
      });

      await load();
      setFormOpen(false);
      setSuccessMsg(`Expense voucher recorded for PKR ${amount.toLocaleString("en-PK")}.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record expense.");
    }
  }

  async function handleCancelExpense(record: ExpenseRecord) {
    if (!window.confirm(`Cancel expense ${record.expenseNumber}?`)) return;
    try {
      await saveExpense({
        id: Number(record.id),
        expense_number: record.expenseNumber,
        category: record.category,
        amount: record.amount,
        expense_date: record.date,
        description: `${record.description} (Cancelled)`.trim(),
        payment_method: record.paymentMethod,
        status: "cancelled",
        created_by: "manager",
        created_at: "",
      });
      await load();
      setSuccessMsg(`Expense ${record.expenseNumber} cancelled.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel expense.");
    }
  }

  function handlePrint(record: ExpenseRecord) {
    printRecord({
      title: "Kiln Expense Voucher",
      subtitle: `Voucher #: ${record.expenseNumber}`,
      sections: [
        {
          title: "Payment Authorization & Details",
          fields: [
            { label: "Expense Voucher #", value: record.expenseNumber },
            { label: "Transaction Date", value: record.date },
            { label: "Expense Category", value: record.category },
            { label: "Disbursed Amount", value: `PKR ${record.amount.toLocaleString("en-PK")}` },
            { label: "Payment Mode", value: record.paymentMethod },
            { label: "Status", value: record.status.toUpperCase() },
            { label: "Purpose / Description", value: record.description || "Authorized kiln business expense." },
          ],
        },
      ],
    });
  }

  function printExpenseSheet() {
    printTable({
      title: "Kiln Operational Expenses Register",
      subtitle: `Total Disbursed: PKR ${totalAmount.toLocaleString("en-PK")} &bull; Records: ${activeRecords.length}`,
      columns: ["Voucher #", "Date", "Category", "Amount (PKR)", "Method", "Description", "Status"],
      rows: visible.map((r) => [
        r.expenseNumber,
        r.date,
        r.category,
        `PKR ${r.amount.toLocaleString("en-PK")}`,
        r.paymentMethod,
        r.description,
        r.status.toUpperCase(),
      ]),
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Expenses & Overheads"
        description="Track daily kiln expenses, food, vehicle fuel, maintenance, labour tea/food, and category-wise costs."
        icon={Wallet}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={printExpenseSheet}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Printer size={15} />
              Print Expenses Register
            </button>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={16} /> New Expense
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Approved Expenses
          </span>
          <p className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">
            PKR {totalAmount.toLocaleString("en-PK")}
          </p>
          <span className="text-xs text-slate-400">{activeRecords.length} recorded vouchers</span>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Food & Mess Expenses
          </span>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
            PKR{" "}
            {activeRecords
              .filter((r) => r.category.toLowerCase().includes("food"))
              .reduce((s, r) => s + r.amount, 0)
              .toLocaleString("en-PK")}
          </p>
          <span className="text-xs text-amber-700/70 dark:text-amber-400/70">Staff & labour meals</span>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-950 dark:bg-indigo-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
            Fuel & Maintenance Overheads
          </span>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            PKR{" "}
            {activeRecords
              .filter(
                (r) =>
                  r.category.toLowerCase().includes("fuel") ||
                  r.category.toLowerCase().includes("maintenance") ||
                  r.category.toLowerCase().includes("generator"),
              )
              .reduce((s, r) => s + r.amount, 0)
              .toLocaleString("en-PK")}
          </p>
          <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Machinery & fuel costs</span>
        </div>
      </div>

      {/* Filter and Category Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="w-full sm:w-80">
          <SearchInput value={search} onChange={setSearch} placeholder="Search expenses by category, note..." />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            {loading && <RefreshCw size={12} className="animate-spin" />}
            {visible.length} record(s)
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="p-3.5">Voucher #</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Payment Method</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visible.map((record) => {
              const isCancelled = record.status === "cancelled" || record.status === "rejected";

              return (
                <tr
                  key={record.id}
                  className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                    isCancelled
                      ? "opacity-50 line-through bg-rose-50/20 text-slate-400 dark:bg-rose-950/10"
                      : ""
                  }`}
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {record.expenseNumber}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">{record.date}</td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {record.category}
                  </td>
                  <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">
                    PKR {record.amount.toLocaleString("en-PK")}
                  </td>
                  <td className="p-3.5">{record.paymentMethod}</td>
                  <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {record.description}
                  </td>
                  <td className="p-3.5 not-italic no-underline">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                        record.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : record.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right not-italic no-underline">
                    <div className="flex items-center justify-end gap-1">
                      {/* Print */}
                      <button
                        type="button"
                        onClick={() => handlePrint(record)}
                        title="Print expense voucher"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Printer size={15} />
                      </button>

                      {/* View */}
                      <button
                        type="button"
                        onClick={() => setViewingRecord(record)}
                        title="View details"
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                      >
                        <Eye size={13} />
                        View
                      </button>

                      {/* Cancel */}
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleCancelExpense(record)}
                          title="Cancel expense voucher"
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
                        >
                          <Ban size={13} />
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

        {!visible.length && (
          <div className="p-8 text-center text-sm text-slate-500">
            No expenses found matching the criteria.
          </div>
        )}
      </div>

      {/* 🌟 NEW EXPENSE MODAL */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateExpense}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Record Kiln Expense
                  </h3>
                  <p className="text-xs text-slate-500">
                    Category expenses for food, fuel, maintenance, or tea
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Expense Category (Configurable in Settings)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-base font-black text-rose-600 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Cash">Cash in Hand</option>
                  <option value="Bank">Bank Account</option>
                  <option value="EasyPaisa">EasyPaisa / JazzCash</option>
                  <option value="Credit">Credit / Payable</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Labour kitchen vegetables and ration, manager bike fuel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <CheckCircle2 size={16} />
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Viewing Dialog */}
      {viewingRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Expense Voucher Details
                </h3>
                <span className="text-xs text-slate-500">
                  Voucher #: {viewingRecord.expenseNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingRecord(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Expense Category</span>
                <span className="font-semibold">{viewingRecord.category}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-rose-600">
                  PKR {viewingRecord.amount.toLocaleString("en-PK")}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Payment Date</span>
                <span className="font-semibold">{viewingRecord.date}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Payment Mode</span>
                <span className="font-semibold">{viewingRecord.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Status</span>
                <span className="font-bold uppercase text-emerald-600">
                  {viewingRecord.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Description</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {viewingRecord.description || "—"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handlePrint(viewingRecord)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Print Voucher
              </button>
              <button
                type="button"
                onClick={() => setViewingRecord(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
