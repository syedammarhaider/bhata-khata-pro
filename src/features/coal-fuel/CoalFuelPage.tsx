// ============================================================
// Bhatta Khata Pro - Coal & Fuel Management
// Add Entry, View, Confirm Truck Delivery, Cancel (Strikethrough), Print
// ============================================================

import { useEffect, useMemo, useState } from "react";
import {
  Flame,
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
import { getCoalFuel, saveCoalFuel } from "../../lib/api";
import type { CoalFuel as ApiCoalFuel } from "../../lib/api";
import { printRecord, printTable } from "../../lib/print";

interface FuelRecord {
  id: string;
  fuelType: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  supplier: string;
  cost: number;
  status: "ordered" | "dispatched" | "received" | "cancelled";
  notes: string;
}

const DEFAULT_FUEL_TYPES = [
  "Coal (کوئلہ - Baluchistan/Duki)",
  "Coal (کوئلہ - Imported/Afghan)",
  "Wood / Firewood (لکڑی)",
  "Rice Husk (توڑی / چھلکا)",
  "Natural Gas (سوئی گیس)",
  "Bagasse / Biomass (پھوک)",
];

export default function CoalFuelPage() {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [fuelTypes, setFuelTypes] = useState<string[]>(DEFAULT_FUEL_TYPES);

  // New Fuel Form Modal
  const [formOpen, setFormOpen] = useState(false);
  const [fuelType, setFuelType] = useState(DEFAULT_FUEL_TYPES[0]);
  const [quantity, setQuantity] = useState<number>(25);
  const [unit, setUnit] = useState("Tons");
  const [purchaseDate, setPurchaseDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [supplier, setSupplier] = useState("");
  const [cost, setCost] = useState<number>(375000);
  const [status, setStatus] = useState<FuelRecord["status"]>("received");
  const [notes, setNotes] = useState("");

  // View modal
  const [viewingRecord, setViewingRecord] = useState<FuelRecord | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [data, settings] = await Promise.all([
        getCoalFuel(),
        invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings").catch(
          () => [],
        ),
      ]);

      setRecords(
        data.map((f: ApiCoalFuel) => ({
          id: String(f.id),
          fuelType: f.fuel_type,
          quantity: f.quantity,
          unit: f.unit,
          purchaseDate: f.purchase_date,
          supplier: f.supplier,
          cost: f.cost,
          status: f.status as FuelRecord["status"],
          notes: f.notes,
        })),
      );

      const fuelSetting = settings.find((s) => s.setting_key === "bhatta_fuel_types");
      if (fuelSetting && fuelSetting.setting_value) {
        try {
          const parsed = JSON.parse(fuelSetting.setting_value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFuelTypes(parsed);
          }
        } catch {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fuel records");
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
        [r.fuelType, r.supplier, r.notes, r.status].some((v) =>
          v.toLowerCase().includes(term),
        );
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [records, search, statusFilter]);

  // Totals
  const activeRecords = records.filter((r) => r.status !== "cancelled");
  const totalCost = activeRecords.reduce((sum, r) => sum + r.cost, 0);
  const totalTons = activeRecords
    .filter((r) => r.unit.toLowerCase().includes("ton"))
    .reduce((sum, r) => sum + r.quantity, 0);

  async function handleCreateFuel(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supplier.trim()) {
      setError("Supplier name is required.");
      return;
    }
    if (!quantity || quantity <= 0) {
      setError("Please specify a valid quantity.");
      return;
    }

    try {
      await saveCoalFuel({
        id: 0,
        fuel_type: fuelType,
        quantity,
        unit,
        purchase_date: purchaseDate,
        supplier: supplier.trim(),
        cost,
        status,
        notes: notes.trim(),
        created_by: "manager",
        created_at: "",
      });

      // If received or ordered, also add an expense entry to connect database
      if (status !== "cancelled") {
        await invoke("save_expense", {
          expense: {
            id: 0,
            expense_number: "",
            category: "Fuel",
            amount: cost,
            expense_date: purchaseDate,
            description: `Fuel purchase: ${quantity} ${unit} of ${fuelType} from ${supplier.trim()}`,
            payment_method: "Bank / Credit",
            status: "approved",
            created_by: "manager",
            created_at: "",
          },
        }).catch(() => {});
      }

      await load();
      setFormOpen(false);
      setSuccessMsg(`Fuel entry recorded for ${supplier}.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setSupplier("");
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record fuel purchase.");
    }
  }

  async function handleConfirmDelivery(record: FuelRecord) {
    try {
      await saveCoalFuel({
        id: Number(record.id),
        fuel_type: record.fuelType,
        quantity: record.quantity,
        unit: record.unit,
        purchase_date: record.purchaseDate,
        supplier: record.supplier,
        cost: record.cost,
        status: "received",
        notes: `${record.notes} (Truck Unloaded & Verified)`.trim(),
        created_by: "manager",
        created_at: "",
      });
      await load();
      setSuccessMsg(`Fuel delivery confirmed: ${record.quantity} ${record.unit} received.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update fuel delivery status.");
    }
  }

  async function handleCancelFuel(record: FuelRecord) {
    if (!window.confirm(`Cancel fuel record from ${record.supplier}?`)) return;
    try {
      await saveCoalFuel({
        id: Number(record.id),
        fuel_type: record.fuelType,
        quantity: record.quantity,
        unit: record.unit,
        purchase_date: record.purchaseDate,
        supplier: record.supplier,
        cost: record.cost,
        status: "cancelled",
        notes: `${record.notes} (Cancelled by manager)`.trim(),
        created_by: "manager",
        created_at: "",
      });
      await load();
      setSuccessMsg(`Fuel record cancelled.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel fuel record.");
    }
  }

  function handlePrint(record: FuelRecord) {
    printRecord({
      title: "Kiln Fuel Delivery & Weighbridge Slip",
      subtitle: `Fuel Type: ${record.fuelType}`,
      sections: [
        {
          title: "Fuel Purchase Details",
          fields: [
            { label: "Fuel Type", value: record.fuelType },
            { label: "Delivered Quantity", value: `${record.quantity.toLocaleString()} ${record.unit}` },
            { label: "Purchase Date", value: record.purchaseDate },
            { label: "Fuel Supplier / Vendor", value: record.supplier },
            { label: "Total Cost", value: `PKR ${record.cost.toLocaleString("en-PK")}` },
            {
              label: "Rate per Unit",
              value: `PKR ${(record.cost / record.quantity).toFixed(2)} per ${record.unit}`,
            },
            { label: "Delivery Status", value: record.status.toUpperCase() },
            { label: "Weighbridge Notes", value: record.notes || "Weighed and verified at kiln." },
          ],
        },
      ],
    });
  }

  function printFuelSheet() {
    printTable({
      title: "Coal & Kiln Fuel Purchase Register",
      subtitle: `Total Cost: PKR ${totalCost.toLocaleString("en-PK")} &bull; Total Coal: ${totalTons.toLocaleString()} Tons`,
      columns: ["Type", "Quantity", "Date", "Supplier", "Cost (PKR)", "Status"],
      rows: visible.map((r) => [
        r.fuelType,
        `${r.quantity.toLocaleString()} ${r.unit}`,
        r.purchaseDate,
        r.supplier,
        `PKR ${r.cost.toLocaleString("en-PK")}`,
        r.status.toUpperCase(),
      ]),
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Coal & Kiln Fuel"
        description="Manage fuel purchases (coal, wood, gas, husk), truck deliveries, kiln burning costs, and supplier payments."
        icon={Flame}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={printFuelSheet}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Printer size={15} />
              Print Fuel Sheet
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
              <Plus size={16} /> New Fuel Purchase
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Fuel Expenditure
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            PKR {totalCost.toLocaleString("en-PK")}
          </p>
          <span className="text-xs text-slate-400">All recorded kiln fuels</span>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-950 dark:bg-indigo-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
            Total Coal Quantity
          </span>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {totalTons.toLocaleString()} Tons
          </p>
          <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
            Used for brick firing in kiln
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Active Fuel Consignments
          </span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activeRecords.length} Deliveries
          </p>
          <span className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
            Verified & weighed
          </span>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search supplier, fuel type..." />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="received">Received / Delivered</option>
            <option value="dispatched">Dispatched (On Truck)</option>
            <option value="ordered">Ordered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            {loading && <RefreshCw size={12} className="animate-spin" />}
            {visible.length} record(s)
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="p-3.5">Fuel Type</th>
              <th className="p-3.5">Quantity</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Supplier</th>
              <th className="p-3.5">Total Cost</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visible.map((record) => {
              const isCancelled = record.status === "cancelled";

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
                    {record.fuelType}
                  </td>
                  <td className="p-3.5 font-semibold text-indigo-700 dark:text-indigo-400">
                    {record.quantity.toLocaleString()} {record.unit}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">{record.purchaseDate}</td>
                  <td className="p-3.5 font-medium">{record.supplier}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    PKR {record.cost.toLocaleString("en-PK")}
                  </td>
                  <td className="p-3.5 not-italic no-underline">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                        record.status === "received"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : record.status === "dispatched"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : record.status === "ordered"
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
                        title="Print weighbridge voucher"
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

                      {/* Confirm Truck Delivery / Received */}
                      {!isCancelled && record.status !== "received" && (
                        <button
                          type="button"
                          onClick={() => handleConfirmDelivery(record)}
                          title="Confirm truck delivery / unloading"
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
                        >
                          <CheckCircle2 size={13} />
                          Confirm Delivery
                        </button>
                      )}

                      {/* Cancel */}
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleCancelFuel(record)}
                          title="Cancel fuel record"
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
            No fuel purchases or delivery records found.
          </div>
        )}
      </div>

      {/* 🌟 NEW FUEL PURCHASE MODAL */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateFuel}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Flame size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Add Kiln Fuel Purchase
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record coal, wood, or gas deliveries and supplier costs
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
                  Fuel Type (Editable in Settings)
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {fuelTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Delivered Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Tons">Tons (ٹن)</option>
                    <option value="Bags">Bags (بوریاں)</option>
                    <option value="KG">Kilograms (کلوگرام)</option>
                    <option value="Truck Load">Truck Load (ڈمپر / ٹرک)</option>
                    <option value="MMBTU">MMBTU (گیس)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Supplier / Vendor Name
                  </label>
                  <input
                    required
                    placeholder="e.g. Quetta Coal Mining Co."
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Cost (PKR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-base font-black text-indigo-600 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Delivery Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FuelRecord["status"])}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="received">Received / Delivered</option>
                    <option value="dispatched">Truck Dispatched (On Way)</option>
                    <option value="ordered">Confirmed Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes & Weighbridge Slip #
                </label>
                <input
                  placeholder="e.g. WB-5432, 28.5 tons net weight, truck LEA-9922..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                Save Fuel Purchase
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
                  Fuel Delivery Voucher
                </h3>
                <span className="text-xs text-slate-500">
                  Supplier: {viewingRecord.supplier}
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
                <span className="text-slate-500">Fuel Classification</span>
                <span className="font-semibold">{viewingRecord.fuelType}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Quantity</span>
                <span className="font-bold text-indigo-600">
                  {viewingRecord.quantity.toLocaleString()} {viewingRecord.unit}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Purchase Date</span>
                <span className="font-semibold">{viewingRecord.purchaseDate}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Total Purchase Price</span>
                <span className="font-black text-slate-900 dark:text-white">
                  PKR {viewingRecord.cost.toLocaleString("en-PK")}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Status</span>
                <span className="font-bold uppercase text-emerald-600">
                  {viewingRecord.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Remarks</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {viewingRecord.notes || "—"}
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
