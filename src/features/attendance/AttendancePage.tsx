// ============================================================
// Bhatta Khata Pro - Daily Worker Attendance
// Automatic shift hours, attendance metrics, print engine
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  CalendarCheck,
  Printer,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import { printTable } from "../../lib/print";

interface AttendanceRecord {
  id: number;
  worker_id: number;
  worker_name: string;
  attendance_date: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  break_minutes: number;
  payable_hours: number;
  notes: string;
  recorded_by: string;
}

interface Worker {
  id: number;
  worker_code: string;
  name: string;
  status: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [workerId, setWorkerId] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [checkIn, setCheckIn] = useState("08:00");
  const [checkOut, setCheckOut] = useState("16:00");
  const [hoursDraft, setHoursDraft] = useState(8);

  async function load() {
    try {
      const [attendance, workerList] = await Promise.all([
        invoke<AttendanceRecord[]>("get_attendance"),
        invoke<Worker[]>("get_workers"),
      ]);
      setRecords(attendance);
      setWorkers(workerList.filter((w) => w.status === "active"));
      if (!workerId && workerList.length > 0) setWorkerId(workerList[0].id);
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(
    () =>
      records.filter(
        (record) =>
          record.worker_name.toLowerCase().includes(search.toLowerCase()) &&
          (statusFilter === "all" || record.status === statusFilter),
      ),
    [records, search, statusFilter],
  );

  // Today's metrics
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.attendance_date === todayKey);
  const presentToday = todayRecords.filter(
    (r) => r.status === "present" || r.status === "late" || r.status === "half_day",
  ).length;
  const absentToday = todayRecords.filter((r) => r.status === "absent").length;
  const leaveToday = todayRecords.filter(
    (r) => r.status === "leave" || r.status === "weekly_off" || r.status === "holiday",
  ).length;

  async function saveAttendance() {
    setError("");
    setMessage("");
    if (!workerId) {
      setError("Select a worker before saving attendance.");
      return;
    }

    const selectedWorker = workers.find((w) => w.id === workerId);
    let payableHours = hoursDraft;

    if (attendanceStatus === "absent") {
      payableHours = 0;
    } else if (attendanceStatus === "half_day") {
      payableHours = 4;
    }

    try {
      await invoke("upsert_attendance", {
        record: {
          id: 0,
          worker_id: workerId,
          worker_name: selectedWorker?.name || "",
          attendance_date: date,
          status: attendanceStatus,
          check_in: checkIn || null,
          check_out: checkOut || null,
          break_minutes: 0,
          payable_hours: payableHours,
          notes: "",
          recorded_by: "admin",
        },
      });
      await load();
      setMessage(`Attendance recorded for ${selectedWorker?.name || "worker"}.`);
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      setError(String(err));
    }
  }

  function printDailySheet() {
    printTable({
      title: "Daily Kiln Worker Attendance Register",
      subtitle: `Date: ${date} &bull; Total Recorded: ${visible.length}`,
      columns: [
        "Worker Name",
        "Attendance Date",
        "Shift Status",
        "Check In",
        "Check Out",
        "Payable Hours",
      ],
      rows: visible.map((r) => [
        r.worker_name,
        r.attendance_date,
        r.status.toUpperCase(),
        r.check_in || "—",
        r.check_out || "—",
        `${r.payable_hours} Hours`,
      ]),
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Worker Attendance"
        description="Daily check-in, check-out, shift hours, and workforce presence monitoring."
        icon={CalendarCheck}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={printDailySheet}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Printer size={15} />
              Print Attendance Sheet
            </button>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {message}
        </div>
      )}

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Workforce
          </span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {workers.length} Workers
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Present Today
          </span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {presentToday || workers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm dark:border-rose-950 dark:bg-rose-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300">
            Absent Today
          </span>
          <p className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">
            {absentToday}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            On Leave / Off
          </span>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
            {leaveToday}
          </p>
        </div>
      </div>

      {/* Mark Attendance Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Mark Worker Attendance
        </h3>
        <div className="grid gap-3 md:grid-cols-6">
          <label className="text-xs font-semibold text-slate-700 md:col-span-2 dark:text-slate-300">
            Worker
            <select
              value={workerId}
              onChange={(e) => setWorkerId(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value={0}>Select worker...</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} ({worker.worker_code})
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Status
            <select
              value={attendanceStatus}
              onChange={(e) => {
                const val = e.target.value;
                setAttendanceStatus(val);
                if (val === "present" || val === "late") setHoursDraft(8);
                else if (val === "half_day") setHoursDraft(4);
                else setHoursDraft(0);
              }}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="present">Present (حاضر)</option>
              <option value="absent">Absent (غیر حاضر)</option>
              <option value="half_day">Half Day (نصف دن)</option>
              <option value="late">Late Arrival (تاخیر)</option>
              <option value="leave">Approved Leave (چھٹی)</option>
              <option value="weekly_off">Weekly Off (ہفتہ وار چھٹی)</option>
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Check-In
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Check-Out
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Shift Hours
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hoursDraft}
              onChange={(e) => setHoursDraft(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <button
            type="button"
            onClick={saveAttendance}
            className="self-end rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search worker attendance..."
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">All statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half_day">Half day</option>
              <option value="leave">Leave</option>
            </select>
            <span className="text-xs text-slate-500">{visible.length} record(s)</span>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="No attendance records found"
            description="Use the form above to record daily attendance."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5">Worker Name</th>
                  <th className="p-3.5">Attendance Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Shift Hours</th>
                  <th className="p-3.5">Check In / Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visible.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {record.worker_name}
                    </td>
                    <td className="p-3.5">{record.attendance_date}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          record.status === "present"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : record.status === "absent"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : record.status === "half_day"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold">
                      {record.payable_hours} Hours
                    </td>
                    <td className="p-3.5 text-xs text-slate-500">
                      {record.check_in || "08:00"} &ndash; {record.check_out || "16:00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
