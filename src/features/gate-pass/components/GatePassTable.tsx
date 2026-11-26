// ============================================================
// Bhatta Khata Pro - Gate Pass Table
// View, Cancel, Print ONLY (Delete removed).
// Cancelled passes show dim and strikethrough.
// ============================================================

import { Printer, Eye, Ban } from "lucide-react";
import type { GatePass } from "../gatePass.types";
import { GatePassStatusBadge } from "./GatePassStatusBadge";

export function GatePassTable({
  items,
  statusOptions,
  onStatusChange,
  onView,
  onPrint,
}: {
  items: GatePass[];
  statusOptions?: GatePass["status"][];
  onStatusChange?: (pass: GatePass, status: GatePass["status"]) => void;
  onView?: (pass: GatePass) => void;
  onPrint?: (pass: GatePass) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="p-3.5">Pass #</th>
            <th className="p-3.5">Customer</th>
            <th className="p-3.5">Dispatch Date</th>
            <th className="p-3.5">Vehicle #</th>
            <th className="p-3.5">Driver & Phone</th>
            <th className="p-3.5">Grade</th>
            <th className="p-3.5">Quantity</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((p) => {
            const isCancelled = p.status === "cancelled";

            return (
              <tr
                key={p.id}
                className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                  isCancelled
                    ? "opacity-50 line-through bg-rose-50/20 text-slate-400 dark:bg-rose-950/10"
                    : ""
                }`}
              >
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  {p.passNumber}
                </td>
                <td className="p-3.5 font-medium">{p.customerName}</td>
                <td className="p-3.5 whitespace-nowrap">{p.dispatchDate}</td>
                <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {p.vehicleNumber}
                </td>
                <td className="p-3.5">
                  <span className="font-medium">{p.driverName}</span>
                  {p.driverPhone && (
                    <span className="block text-xs text-slate-400 not-italic no-underline">
                      {p.driverPhone}
                    </span>
                  )}
                </td>
                <td className="p-3.5">{p.brickGrade}</td>
                <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                  {p.quantity.toLocaleString()} {p.unit}
                </td>
                <td className="p-3.5 not-italic no-underline">
                  {onStatusChange && statusOptions && !isCancelled ? (
                    <select
                      value={p.status}
                      onChange={(e) =>
                        onStatusChange(p, e.target.value as GatePass["status"])
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-600 dark:bg-slate-800"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <GatePassStatusBadge status={p.status} />
                  )}
                </td>
                <td className="p-3.5 text-right not-italic no-underline">
                  <div className="flex items-center justify-end gap-1">
                    {onPrint && (
                      <button
                        type="button"
                        onClick={() => onPrint(p)}
                        title="Print gate pass"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Printer size={16} />
                      </button>
                    )}

                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(p)}
                        title="View details"
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    )}

                    {onStatusChange && !isCancelled && p.status !== "delivered" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Cancel gate pass ${p.passNumber}?`)) {
                            onStatusChange(p, "cancelled");
                          }
                        }}
                        title="Cancel this dispatch"
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
      {!items.length && (
        <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No gate passes or dispatches found.
        </p>
      )}
    </div>
  );
}
