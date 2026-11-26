// ============================================================
// Bhatta Khata Pro - Gate Pass Page
// View, Cancel, Print ONLY (Delete removed).
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Truck, Plus, RefreshCw, X } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { printRecord } from "../../lib/print";
import {
  getGatePasses,
  saveGatePass,
  updateGatePassStatus,
} from "../../lib/api";
import type { GatePass as ApiGatePass } from "../../lib/api";
import type { GatePass } from "./gatePass.types";
import { GatePassSummaryCards } from "./components/GatePassSummaryCards";
import { GatePassFilters } from "./components/GatePassFilters";
import { GatePassTable } from "./components/GatePassTable";
import { GatePassForm } from "./components/GatePassForm";

const STATUS_OPTIONS: GatePass["status"][] = [
  "prepared",
  "approved",
  "dispatched",
  "delivered",
  "cancelled",
];

export default function GatePassPage() {
  const [items, setItems] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [viewingPass, setViewingPass] = useState<GatePass | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const records = await getGatePasses();
      setItems(
        records.map((record: ApiGatePass) => ({
          id: String(record.id),
          passNumber: record.pass_number,
          orderId: record.order_id ? String(record.order_id) : undefined,
          customerId: String(record.customer_id),
          customerName: record.customer_name,
          dispatchDate: record.dispatch_date,
          vehicleNumber: record.vehicle_number,
          driverName: record.driver_name,
          driverPhone: record.driver_phone,
          brickGrade: record.brick_grade,
          quantity: record.quantity,
          unit: record.unit,
          destination: record.destination,
          status: record.status as GatePass["status"],
          notes: record.notes,
          createdAt: record.created_at,
        })),
      );
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(
    () =>
      items.filter((p) =>
        `${p.passNumber} ${p.customerName} ${p.vehicleNumber} ${p.driverName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [items, search],
  );

  async function handleSave(pass: GatePass) {
    setError("");
    try {
      await saveGatePass({
        id: 0,
        pass_number: pass.passNumber,
        order_id: pass.orderId ? Number(pass.orderId) : null,
        customer_id: Number(pass.customerId) || 0,
        customer_name: pass.customerName,
        dispatch_date: pass.dispatchDate,
        vehicle_number: pass.vehicleNumber,
        driver_name: pass.driverName,
        driver_phone: pass.driverPhone,
        brick_grade: pass.brickGrade,
        quantity: pass.quantity,
        unit: pass.unit,
        destination: pass.destination,
        status: pass.status,
        notes: pass.notes ?? "",
        created_by: "manager",
        created_at: "",
      });
      await load();
      setOpen(false);
      setSuccessMsg(`Gate pass ${pass.passNumber} generated.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleStatusChange(pass: GatePass, status: GatePass["status"]) {
    setError("");
    try {
      await updateGatePassStatus(Number(pass.id), status);
      await load();
      setSuccessMsg(`Gate pass ${pass.passNumber} status updated to ${status}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(String(err));
    }
  }

  function handlePrint(pass: GatePass) {
    printRecord({
      title: "Kiln Dispatch Gate Pass",
      subtitle: `Pass #: ${pass.passNumber}`,
      sections: [
        {
          title: "Dispatch Authorization",
          fields: [
            { label: "Gate Pass #", value: pass.passNumber },
            { label: "Dispatch Date", value: pass.dispatchDate },
            { label: "Customer Name", value: pass.customerName },
            { label: "Destination / Site", value: pass.destination || "Site delivery" },
            { label: "Status", value: pass.status.toUpperCase() },
          ],
        },
        {
          title: "Transport & Driver Fleet Details",
          fields: [
            { label: "Vehicle Number", value: pass.vehicleNumber },
            { label: "Driver Name", value: pass.driverName },
            { label: "Driver Contact", value: pass.driverPhone || "—" },
            { label: "Estimated Delivery", value: "3 - 4 Hours" },
          ],
        },
        {
          title: "Brick Material Loaded",
          fields: [
            { label: "Brick Grade", value: pass.brickGrade },
            { label: "Loaded Quantity", value: `${pass.quantity.toLocaleString()} ${pass.unit}` },
            { label: "Notes / Gate Instructions", value: pass.notes || "Inspected and weighed at kiln exit." },
          ],
        },
      ],
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gate Pass & Dispatches"
        description="Issue vehicle gate passes, track dispatched brick consignments, and monitor delivery drivers."
        icon={Truck}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={16} /> New Gate Pass
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

      <GatePassSummaryCards items={items} />

      <GatePassFilters search={search} onSearch={setSearch} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <GatePassTable
          items={visible}
          statusOptions={STATUS_OPTIONS}
          onStatusChange={handleStatusChange}
          onView={(p) => setViewingPass(p)}
          onPrint={handlePrint}
        />
      )}

      {open && (
        <GatePassForm
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Quick View Dialog */}
      {viewingPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Gate Pass Details &bull; {viewingPass.passNumber}
                </h3>
                <span className="text-xs text-slate-500">
                  Vehicle: {viewingPass.vehicleNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingPass(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Customer</span>
                <span className="font-semibold">{viewingPass.customerName}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Dispatch Date</span>
                <span className="font-semibold">{viewingPass.dispatchDate}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Driver</span>
                <span className="font-semibold">
                  {viewingPass.driverName} {viewingPass.driverPhone ? `(${viewingPass.driverPhone})` : ""}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Brick Grade</span>
                <span className="font-bold">{viewingPass.brickGrade}</span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Dispatched Quantity</span>
                <span className="font-bold text-emerald-600">
                  {viewingPass.quantity.toLocaleString()} {viewingPass.unit}
                </span>
              </div>
              <div className="flex justify-between border-b py-1.5 dark:border-slate-800">
                <span className="text-slate-500">Destination</span>
                <span className="font-semibold">{viewingPass.destination || "Site delivery"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Dispatch Status</span>
                <span className="font-bold uppercase text-indigo-600">{viewingPass.status}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handlePrint(viewingPass)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Print Gate Pass
              </button>
              <button
                type="button"
                onClick={() => setViewingPass(null)}
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
