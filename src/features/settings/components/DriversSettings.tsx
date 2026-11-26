// ============================================================
// Bhatta Khata Pro - Driver Fleet Settings
// Add / Edit Drivers, Vehicle numbers, and Live Availability
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getDrivers, saveDrivers, type Driver } from "../../../lib/drivers";

export default function DriversSettings() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  // New Driver Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getDrivers().then(setDrivers);
  }, []);

  async function persist(newList: Driver[]) {
    try {
      await saveDrivers(newList);
      setDrivers(newList);
      setSavedMsg("Driver fleet updated in database.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setError(String(err));
    }
  }

  const handleAdd = () => {
    if (!name.trim() || !vehicleNumber.trim()) {
      setError("Driver name and vehicle number are required.");
      return;
    }

    const newDriver: Driver = {
      id: `drv-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || "0300-0000000",
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      status: "available",
      freeAfterHours: 0,
      notes: notes.trim(),
    };

    const updated = [...drivers, newDriver];
    setName("");
    setPhone("");
    setVehicleNumber("");
    setNotes("");
    setError("");
    void persist(updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated: Driver[] = drivers.map((d) => {
      if (d.id !== id) return d;
      const nextStatus: "available" | "on_trip" = d.status === "available" ? "on_trip" : "available";
      const nextHours = nextStatus === "on_trip" ? 4 : 0;
      return { ...d, status: nextStatus, freeAfterHours: nextHours };
    });
    void persist(updated);
  };

  const handleUpdateHours = (id: string, hours: number) => {
    const updated: Driver[] = drivers.map((d) => {
      if (d.id !== id) return d;
      const nextStatus: "available" | "on_trip" = hours > 0 ? "on_trip" : "available";
      return { ...d, freeAfterHours: hours, status: nextStatus };
    });
    void persist(updated);
  };

  const handleRemove = (id: string) => {
    if (drivers.length <= 1) {
      setError("At least one driver must remain.");
      return;
    }
    const updated = drivers.filter((d) => d.id !== id);
    void persist(updated);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Delivery Driver Fleet & Vehicle Management
          </h3>
          <p className="text-xs text-slate-500">
            Manage drivers, assign vehicles (e.g. LEB-1234), and configure live availability. Free drivers are selectable on Gate Pass & Orders.
          </p>
        </div>

        {savedMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            {savedMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Add Driver Card */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 mb-5 dark:border-slate-800 dark:bg-slate-800/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 mb-3 dark:text-indigo-200">
            + Add New Kiln Driver
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input
              placeholder="Driver Name (e.g. Muhammad Tariq)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Phone (0300-1234567)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Vehicle # (e.g. LEB-1234)"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={15} /> Add Driver
            </button>
          </div>
        </div>

        {/* Drivers List Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              <tr>
                <th className="p-3">Driver Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Vehicle #</th>
                <th className="p-3">Status</th>
                <th className="p-3">Free After (Hours)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {drivers.map((drv) => (
                <tr
                  key={drv.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {drv.name}
                  </td>
                  <td className="p-3">{drv.phone}</td>
                  <td className="p-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    {drv.vehicleNumber}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(drv.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                        drv.status === "available"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          drv.status === "available" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {drv.status === "available" ? "Available (Free)" : "On Trip (Click to Free)"}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="72"
                        value={drv.freeAfterHours}
                        onChange={(e) => handleUpdateHours(drv.id, Number(e.target.value))}
                        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <span className="text-slate-400">hours</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(drv.id)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                      title="Remove driver"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
