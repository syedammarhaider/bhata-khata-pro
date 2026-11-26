// ============================================================
// Bhatta Khata Pro - Smart Labour Wages & Payroll Ledger
// Automatic salary calculation based on hours, leaves & attendance.
// Multi-installment payment tracking (Remaining / Completed / Negative Advance).
// Instant print engine for salary slips & monthly register.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Printer,
  RefreshCw,
  CheckCircle2,
  Calendar,
  X,
  CreditCard,
} from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import PageHeader from "../../components/common/PageHeader";
import { printRecord, printTable } from "../../lib/print";
import { getWages, saveWage, getWorkers, getAttendance, getAppSettings } from "../../lib/api";
import type { Wage as ApiWage } from "../../lib/api";

interface Worker {
  id: number;
  worker_code: string;
  name: string;
  phone: string;
  labour_group: string;
  work_category: string;
  payment_method: string;
  wage_rate: number;
  status: string;
}

interface AttendanceItem {
  id: number;
  worker_id: number;
  attendance_date: string;
  status: string;
  payable_hours: number;
}

interface WorkerSalaryRow {
  workerId: number;
  workerCode: string;
  workerName: string;
  phone: string;
  category: string;
  monthlySalary: number;
  standardHours: number;
  allowedLeaves: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  earnedSalary: number;
  paidAmount: number;
  remainingBalance: number;
  status: "completed" | "partial" | "unpaid" | "advance";
  paymentHistory: { amount: number; date: string; notes: string }[];
}

export default function WagesPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [wages, setWages] = useState<ApiWage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  // Month selector (default: current month YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // Settings
  const [standardHours, setStandardHours] = useState(8);
  const [allowedLeaves, setAllowedLeaves] = useState(4); // 4 days off allowed per month without deduction

  // Pay modal
  const [payWorker, setPayWorker] = useState<WorkerSalaryRow | null>(null);
  const [payAmount, setPayAmount] = useState<number>(5000);
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payNotes, setPayNotes] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [workerList, attendList, wageList, settingsList] = await Promise.all([
        getWorkers().catch(() => []),
        getAttendance().catch(() => []),
        getWages().catch(() => []),
        getAppSettings().catch(() => []),
      ]);

      setWorkers(workerList.filter((w: Worker) => w.status === "active"));
      setAttendance(attendList);
      setWages(wageList);

      const foundHours = settingsList.find((s: any) => s.setting_key === "labour_standard_hours");
      if (foundHours && foundHours.setting_value) {
        setStandardHours(Number(foundHours.setting_value) || 8);
      }
      const foundLeaves = settingsList.find((s: any) => s.setting_key === "labour_allowed_leaves");
      if (foundLeaves && foundLeaves.setting_value) {
        setAllowedLeaves(Number(foundLeaves.setting_value) || 4);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load labour and wage data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  // Compute calculated salary rows for all workers in the selected month
  const computedRows: WorkerSalaryRow[] = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const daysInMonth = new Date(year, month, 0).getDate(); // 28 - 31 days

    return workers.map((w) => {
      // Monthly salary decided for worker (default 30,000 if not set)
      const decidedSalary = w.wage_rate > 0 ? w.wage_rate : 30000;

      // Filter worker attendance for this month
      const workerMonthAttend = attendance.filter((a) => {
        if (a.worker_id !== w.id) return false;
        const aMonth = a.attendance_date.slice(0, 7);
        return aMonth === selectedMonth;
      });

      let presentCount = 0;
      let halfCount = 0;
      let leaveCount = 0;
      let absentCount = 0;

      workerMonthAttend.forEach((att) => {
        if (att.status === "present" || att.status === "late") presentCount++;
        else if (att.status === "half_day") halfCount++;
        else if (att.status === "leave" || att.status === "weekly_off" || att.status === "holiday")
          leaveCount++;
        else if (att.status === "absent") absentCount++;
      });

      // If no attendance recorded yet for the month, assume standard active days
      const totalRecorded = presentCount + halfCount + leaveCount + absentCount;
      if (totalRecorded === 0) {
        presentCount = Math.max(0, daysInMonth - allowedLeaves);
        leaveCount = allowedLeaves;
      }

      // Allowed leaves calculation: leaves within allowed quota have ZERO deduction!
      // Excess leaves count as unpaid absences.
      const excessLeaves = Math.max(0, leaveCount - allowedLeaves);
      const effectiveAbsents = absentCount + excessLeaves;

      // Daily wage for 30-day base
      const dailyWage = decidedSalary / 30;
      const deduction = effectiveAbsents * dailyWage + halfCount * (dailyWage / 2);
      const earned = Math.max(0, Math.round(decidedSalary - deduction));

      // Calculate payments already made to this worker in this period from wages records
      const paymentsForWorker = wages.filter(
        (wage) =>
          (wage.worker_id === w.id || wage.worker_name === w.name) &&
          (wage.period_start?.startsWith(selectedMonth) || wage.payment_date?.startsWith(selectedMonth)),
      );

      const totalPaid = paymentsForWorker.reduce(
        (sum, item) => sum + (item.advances || item.net_amount || 0),
        0,
      );

      const remaining = earned - totalPaid;

      let status: WorkerSalaryRow["status"] = "unpaid";
      if (remaining === 0 && totalPaid > 0) status = "completed";
      else if (remaining < 0) status = "advance";
      else if (totalPaid > 0) status = "partial";

      return {
        workerId: w.id,
        workerCode: w.worker_code,
        workerName: w.name,
        phone: w.phone,
        category: w.work_category || "Kiln Worker",
        monthlySalary: decidedSalary,
        standardHours,
        allowedLeaves,
        presentDays: presentCount,
        leaveDays: leaveCount,
        absentDays: effectiveAbsents,
        earnedSalary: earned,
        paidAmount: totalPaid,
        remainingBalance: remaining,
        status,
        paymentHistory: paymentsForWorker.map((p) => ({
          amount: p.advances || p.net_amount,
          date: p.payment_date || p.period_start || "",
          notes: p.notes || "Salary Installment",
        })),
      };
    });
  }, [workers, attendance, wages, selectedMonth, standardHours, allowedLeaves]);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return computedRows;
    return computedRows.filter(
      (r) =>
        r.workerName.toLowerCase().includes(q) ||
        r.workerCode.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    );
  }, [computedRows, search]);

  const totalCalculated = computedRows.reduce((s, r) => s + r.earnedSalary, 0);
  const totalPaid = computedRows.reduce((s, r) => s + r.paidAmount, 0);
  const totalPending = computedRows.reduce(
    (s, r) => s + (r.remainingBalance > 0 ? r.remainingBalance : 0),
    0,
  );

  // Handle Recording an Installment Payment
  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payWorker) return;

    if (!payAmount || payAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    setError(null);
    try {
      const wageNum = `WAG-${selectedMonth.replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Save wage / advance installment in database
      await saveWage({
        id: 0,
        wage_number: wageNum,
        worker_id: payWorker.workerId,
        worker_name: payWorker.workerName,
        period_start: `${selectedMonth}-01`,
        period_end: payDate,
        total_days: payWorker.presentDays,
        daily_wage: Math.round(payWorker.monthlySalary / 30),
        total_amount: payWorker.earnedSalary,
        advances: payAmount,
        deductions: 0,
        net_amount: payAmount,
        status: "paid",
        payment_date: payDate,
        notes: payNotes.trim() || `Salary Installment (${payMethod})`,
        created_by: "manager",
        created_at: "",
      });

      // Also record in cashbook/expenses for total financial accuracy
      await invoke("save_expense", {
        expense: {
          id: 0,
          expense_number: "",
          category: "Labour",
          amount: payAmount,
          expense_date: payDate,
          description: `Worker wage installment to ${payWorker.workerName} (${payWorker.workerCode})`,
          payment_method: payMethod,
          status: "approved",
          created_by: "manager",
          created_at: "",
        },
      }).catch(() => {});

      await loadData();
      setSuccessMsg(`Paid PKR ${payAmount.toLocaleString()} to ${payWorker.workerName}.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setPayWorker(null);
      setPayNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record wage payment.");
    }
  }

  // Print Individual Worker Salary Voucher
  function handlePrintSlip(row: WorkerSalaryRow) {
    printRecord({
      title: "Worker Monthly Salary & Wage Slip",
      subtitle: `Worker: ${row.workerName} (${row.workerCode}) &bull; Month: ${selectedMonth}`,
      sections: [
        {
          title: "Worker & Policy Profile",
          fields: [
            { label: "Worker ID", value: row.workerCode },
            { label: "Worker Name", value: row.workerName },
            { label: "Designation / Category", value: row.category },
            { label: "Phone", value: row.phone || "—" },
            { label: "Decided Standard Hours", value: `${row.standardHours} Hours / Day` },
            { label: "Allowed Leaves (No Deduction)", value: `${row.allowedLeaves} Days / Month` },
          ],
        },
        {
          title: "Attendance & Wage Computation",
          fields: [
            { label: "Decided Monthly Base Salary", value: `PKR ${row.monthlySalary.toLocaleString()}` },
            { label: "Present Working Days", value: `${row.presentDays} Days` },
            { label: "Approved Leaves (Paid)", value: `${Math.min(row.leaveDays, row.allowedLeaves)} Days` },
            { label: "Unexcused Absences", value: `${row.absentDays} Days` },
            {
              label: "Calculated Earned Wage",
              value: `PKR ${row.earnedSalary.toLocaleString()}`,
            },
          ],
        },
        {
          title: "Installment Payments & Balance Status",
          fields: [
            { label: "Total Disbursed So Far", value: `PKR ${row.paidAmount.toLocaleString()}` },
            {
              label: "Remaining Balance",
              value:
                row.remainingBalance < 0
                  ? `- PKR ${Math.abs(row.remainingBalance).toLocaleString()} (Extra / Advance Paid)`
                  : `PKR ${row.remainingBalance.toLocaleString()}`,
            },
            {
              label: "Settlement Status",
              value:
                row.status === "completed"
                  ? "COMPLETED (PAID IN FULL)"
                  : row.status === "advance"
                    ? "ADVANCE PAID"
                    : row.status === "partial"
                      ? "PARTIALLY PAID"
                      : "UNPAID",
            },
          ],
        },
        ...(row.paymentHistory.length > 0
          ? [
              {
                title: "Installment Payment History",
                fields: row.paymentHistory.map((h, i) => ({
                  label: `Installment #${i + 1} (${h.date})`,
                  value: `PKR ${h.amount.toLocaleString()} - ${h.notes}`,
                })),
              },
            ]
          : []),
      ],
    });
  }

  // Print Full Monthly Payroll Register
  function handlePrintRegister() {
    printTable({
      title: "Monthly Labour Payroll & Wage Register",
      subtitle: `Reporting Month: ${selectedMonth} &bull; Policy: ${standardHours}h/day, ${allowedLeaves} allowed leaves`,
      columns: [
        "Worker Code",
        "Worker Name",
        "Category",
        "Base Salary",
        "Present Days",
        "Absences",
        "Earned Wage",
        "Paid So Far",
        "Remaining Balance",
        "Status",
      ],
      rows: visibleRows.map((r) => [
        r.workerCode,
        r.workerName,
        r.category,
        `PKR ${r.monthlySalary.toLocaleString()}`,
        r.presentDays,
        r.absentDays,
        `PKR ${r.earnedSalary.toLocaleString()}`,
        `PKR ${r.paidAmount.toLocaleString()}`,
        r.remainingBalance < 0
          ? `- PKR ${Math.abs(r.remainingBalance).toLocaleString()}`
          : `PKR ${r.remainingBalance.toLocaleString()}`,
        r.status.toUpperCase(),
      ]),
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Labour Wages & Attendance Settlements"
        description="Automatic salary calculation based on 8-hour daily shifts, monthly allowed leaves, and installment payments."
        icon={Banknote}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintRegister}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Printer size={15} />
              Print Payroll Register
            </button>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
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

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Calculated Payroll ({selectedMonth})
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            PKR {totalCalculated.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400">
            {computedRows.length} active kiln workers
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Total Wages Disbursed
          </span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            PKR {totalPaid.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
            Paid in installments & advances
          </span>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Remaining Wages Payable
          </span>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
            PKR {totalPending.toLocaleString()}
          </p>
          <span className="text-xs text-amber-700/70 dark:text-amber-400/70">
            Net pending balance to settle
          </span>
        </div>
      </div>

      {/* Filter and Month Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Payroll Month:
            </span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 border-l pl-3 dark:border-slate-800">
            <span>Shift: <strong>{standardHours} Hours/Day</strong></span>
            <span>&bull;</span>
            <span>Allowed Leaves: <strong>{allowedLeaves} Days (No deduction)</strong></span>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search worker by name / code..."
            className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* 🌟 SMART SALARY LEDGER TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="p-3.5">Worker Name</th>
              <th className="p-3.5">Decided Base</th>
              <th className="p-3.5">Attendance Days</th>
              <th className="p-3.5">Earned Wage</th>
              <th className="p-3.5">Paid So Far</th>
              <th className="p-3.5">Remaining Balance</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Instant Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleRows.map((row) => {
              const isCompleted = row.status === "completed";
              const isAdvance = row.status === "advance";

              return (
                <tr
                  key={row.workerId}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {row.workerName}
                    </span>
                    <span className="block text-xs text-slate-400">
                      #{row.workerCode} &bull; {row.category}
                    </span>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    PKR {row.monthlySalary.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-emerald-600">
                      {row.presentDays} Present
                    </span>
                    <span className="block text-xs text-slate-400">
                      {row.leaveDays} Leaves &bull; {row.absentDays} Absents
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    PKR {row.earnedSalary.toLocaleString()}
                  </td>

                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    PKR {row.paidAmount.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    {isAdvance ? (
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        - PKR {Math.abs(row.remainingBalance).toLocaleString()}
                        <span className="block text-[11px] text-indigo-400">Advance Paid</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="font-bold text-emerald-600">
                        PKR 0
                        <span className="block text-[11px] text-emerald-500">Fully Paid</span>
                      </span>
                    ) : (
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        PKR {row.remainingBalance.toLocaleString()}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    ) : isAdvance ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        Advance
                      </span>
                    ) : row.paidAmount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Partial
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Pay Salary / Advance Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPayWorker(row);
                          setPayAmount(row.remainingBalance > 0 ? row.remainingBalance : 5000);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                      >
                        <CreditCard size={13} />
                        Pay Salary
                      </button>

                      {/* Print Salary Slip Button */}
                      <button
                        type="button"
                        onClick={() => handlePrintSlip(row)}
                        title="Print official salary voucher"
                        className="rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Printer size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!visibleRows.length && (
          <div className="p-8 text-center text-sm text-slate-500">
            No worker records found for {selectedMonth}.
          </div>
        )}
      </div>

      {/* 🌟 PAY SALARY / ADVANCE MODAL */}
      {payWorker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleRecordPayment}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pay Salary &bull; {payWorker.workerName}
                </h3>
                <span className="text-xs text-slate-500">
                  Worker ID: #{payWorker.workerCode} &bull; Earned: PKR {payWorker.earnedSalary.toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPayWorker(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Already Paid:</span>
                  <span className="font-bold text-emerald-600">PKR {payWorker.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-500">Remaining Balance:</span>
                  <span className="font-bold text-rose-600">PKR {payWorker.remainingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Payment Amount (PKR)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-black text-indigo-600 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  New Remaining Balance after this payment:{" "}
                  <strong>PKR {(payWorker.remainingBalance - payAmount).toLocaleString()}</strong>
                  {payWorker.remainingBalance - payAmount < 0 && " (Advance / Extra)"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Payment Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Cash">Cash in Hand</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="EasyPaisa">EasyPaisa / JazzCash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes / Receipt Remark
                </label>
                <input
                  placeholder="e.g. 1st installment, weekly advance, bonus..."
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPayWorker(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <CheckCircle2 size={16} />
                Disburse & Save Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
