// ============================================================
// Bhatta Khata Pro - Gate Pass & Dispatch Form
// Integrated Driver Fleet, Availability, Delivery Timing
// ============================================================

import { useState, useEffect, type FormEvent } from "react";
import { X, CheckCircle2, Truck, Clock } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import type { GatePass } from "../gatePass.types";
import { prepareGatePass } from "../gatePass.service";
import { getDrivers, type Driver } from "../../../lib/drivers";
import { findStockForGrade } from "../../../lib/stockLookup";

export function GatePassForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (p: GatePass) => void;
}) {
  const [data, setData] = useState({
    customerId: "",
    customerName: "",
    dispatchDate: new Date().toISOString().slice(0, 10),
    vehicleNumber: "LEB-1234",
    driverName: "",
    driverPhone: "",
    brickGrade: "First Class",
    quantity: 5000,
    unit: "Bricks",
    destination: "",
    notes: "",
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [stockByGrade, setStockByGrade] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    getDrivers().then((dList) => {
      setDrivers(dList);
      if (dList.length > 0) {
        const firstAvail = dList.find((d) => d.status === "available") || dList[0];
        setSelectedDriver(firstAvail);
        setData((prev) => ({
          ...prev,
          driverName: firstAvail.name,
          driverPhone: firstAvail.phone,
          vehicleNumber: firstAvail.vehicleNumber,
        }));
      }
    });

    invoke<any[]>("get_customers")
      .then((cList) => setCustomers(cList.filter((c) => c.status === "active")))
      .catch(() => {});

    invoke<any[]>("get_brick_grades")
      .then((gList) => {
        const active = gList.filter((g) => g.is_active);
        setGrades(active);
        if (active.length > 0) {
          setData((prev) => ({ ...prev, brickGrade: active[0].name }));
        }
      })
      .catch(() => {});

    invoke<{ grade_name: string; quantity: number }[]>("get_inventory")
      .then((rows) => {
        const map: Record<string, number> = {};
        rows.forEach((row) => {
          map[(row.grade_name ?? "").toLowerCase()] = row.quantity ?? 0;
        });
        setStockByGrade(map);
      })
      .catch(() => {});
  }, []);

  const change = (key: keyof typeof data, value: string | number) =>
    setData((d) => ({ ...d, [key]: value }));

  const handleDriverChange = (driverId: string) => {
    const drv = drivers.find((d) => d.id === driverId);
    if (drv) {
      setSelectedDriver(drv);
      setData((prev) => ({
        ...prev,
        driverName: drv.name,
        driverPhone: drv.phone,
        vehicleNumber: drv.vehicleNumber,
      }));
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!data.customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!data.quantity || data.quantity <= 0) {
      setError("Please specify a valid dispatch quantity.");
      return;
    }

    try {
      onSave(prepareGatePass(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid gate pass data.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Truck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                New Kiln Dispatch &bull; Gate Pass
              </h2>
              <p className="text-xs text-slate-500">
                Authorize brick truck release, assign driver, and track delivery
              </p>
            </div>
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
          {/* Customer & Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Customer Name
              </label>
              <input
                required
                list="gatepass-customers"
                placeholder="Enter or select customer name..."
                value={data.customerName}
                onChange={(e) => {
                  change("customerName", e.target.value);
                  const found = customers.find((c) => c.name === e.target.value);
                  if (found) change("customerId", String(found.id));
                }}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <datalist id="gatepass-customers">
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Dispatch Date
              </label>
              <input
                type="date"
                required
                value={data.dispatchDate}
                onChange={(e) => change("dispatchDate", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* 🌟 DRIVER SELECTION & AVAILABILITY STATUS */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                Assign Kiln Driver & Vehicle Fleet
              </label>

              {selectedDriver && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    selectedDriver.status === "available"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      selectedDriver.status === "available" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {selectedDriver.status === "available"
                    ? "Available (Free Now)"
                    : `On Trip (Free after ~${selectedDriver.freeAfterHours} hours)`}
                </span>
              )}
            </div>

            <select
              value={selectedDriver?.id || ""}
              onChange={(e) => handleDriverChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Select Managed Driver...</option>
              {drivers.map((drv) => (
                <option key={drv.id} value={drv.id}>
                  {drv.name} &bull; {drv.vehicleNumber} &bull;{" "}
                  {drv.status === "available" ? "🟢 Free" : `🟡 On Trip (Free in ${drv.freeAfterHours}h)`}
                </option>
              ))}
            </select>

            {/* Estimated timing information */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/80 p-2.5 text-xs text-slate-700 shadow-xs dark:bg-slate-900/80 dark:text-slate-300">
              <Clock size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong>Approximate Delivery Time:</strong> 3 &ndash; 4 hours. Vehicle free after safe unloading at destination.
              </span>
            </div>
          </div>

          {/* Vehicle Number, Driver Name, Driver Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Vehicle Number
              </label>
              <input
                required
                placeholder="e.g. LEB-1234"
                value={data.vehicleNumber}
                onChange={(e) => change("vehicleNumber", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold uppercase outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Driver Name
              </label>
              <input
                required
                placeholder="Driver name..."
                value={data.driverName}
                onChange={(e) => change("driverName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Driver Phone
              </label>
              <input
                placeholder="0300-0000000"
                value={data.driverPhone}
                onChange={(e) => change("driverPhone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Brick Grade & Quantity */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Brick Grade
              </label>
              <select
                value={data.brickGrade}
                onChange={(e) => change("brickGrade", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {grades.length > 0 ? (
                  grades.map((g) => (
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

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                step="500"
                required
                value={data.quantity}
                onChange={(e) => change("quantity", Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {findStockForGrade(stockByGrade, data.brickGrade) !== undefined && (
                <p
                  className={`mt-1 text-xs ${
                    data.quantity > (findStockForGrade(stockByGrade, data.brickGrade) ?? 0)
                      ? "font-semibold text-rose-600"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  Available stock: {findStockForGrade(stockByGrade, data.brickGrade)!.toLocaleString()} bricks
                  {data.quantity > (findStockForGrade(stockByGrade, data.brickGrade) ?? 0) && " — exceeds available!"}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Unit
              </label>
              <input
                value={data.unit}
                onChange={(e) => change("unit", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Destination & Notes */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Destination Address / Site
              </label>
              <input
                placeholder="e.g. Plot 45, Gulberg Road, Lahore"
                value={data.destination}
                onChange={(e) => change("destination", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Dispatch Notes
              </label>
              <input
                placeholder="e.g. Weighbridge slip attached, driver instructed..."
                value={data.notes}
                onChange={(e) => change("notes", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
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
            Issue Gate Pass
          </button>
        </div>
      </form>
    </div>
  );
}
