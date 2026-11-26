// FILE 463: src/features/labour/LabourPage.tsx
import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";

interface WorkerRecord {
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

export default function LabourPage() {
  const [records, setRecords] = useState<WorkerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<WorkerRecord>({
    id: 0, worker_code: "", name: "", phone: "", labour_group: "",
    work_category: "", payment_method: "daily", wage_rate: 0, status: "active",
  });

  async function load() {
    try {
      setRecords(await invoke<WorkerRecord[]>("get_workers"));
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => { void load(); }, []);
  const visible = useMemo(
    () => records.filter((record) =>
      record.name.toLowerCase().includes(search.toLowerCase()) ||
      record.worker_code.toLowerCase().includes(search.toLowerCase())
    ),
    [records, search]
  );

  async function save() {
    setError("");
    setMessage("");
    try {
      await invoke("save_worker", { worker: draft });
      setDraft({ id: 0, worker_code: "", name: "", phone: "", labour_group: "", work_category: "", payment_method: "daily", wage_rate: 0, status: "active" });
      await load();
      setMessage("Worker saved.");
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Labour & Workers" description="Manage labour & workers and review their activity." />
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
        <label className="text-sm font-medium">Worker ID
          <input value={draft.worker_code} onChange={(e) => setDraft({ ...draft, worker_code: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Name
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Phone
          <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Payment method
          <select value={draft.payment_method} onChange={(e) => setDraft({ ...draft, payment_method: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5">
            <option value="daily">Daily wage</option><option value="hourly">Hourly wage</option><option value="piece">Per thousand bricks</option><option value="monthly">Fixed monthly salary</option>
          </select>
        </label>
        <label className="text-sm font-medium">Labour group
          <input value={draft.labour_group} onChange={(e) => setDraft({ ...draft, labour_group: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Work category
          <input value={draft.work_category} onChange={(e) => setDraft({ ...draft, work_category: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Wage rate
          <input type="number" min="0" step="0.01" value={draft.wage_rate} onChange={(e) => setDraft({ ...draft, wage_rate: Number(e.target.value) })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <button type="button" onClick={save} className="self-end rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">{draft.id ? "Update worker" : "Add worker"}</button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search workers..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {visible.length === 0 ? (
          <EmptyState title="No workers yet" description="Records will appear here when they are added. SQLite persistence will be connected during the integration phase." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Worker</th><th className="p-3">Phone</th><th className="p-3">Payment</th><th className="p-3">Rate</th><th className="p-3">Status</th><th /></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.name} <span className="text-xs text-slate-500">#{record.worker_code}</span></td><td className="p-3">{record.phone || "—"}</td><td className="p-3">{record.payment_method}</td><td className="p-3">{record.wage_rate}</td><td className="p-3">{record.status}</td><td className="p-3 text-right"><button type="button" onClick={() => setDraft(record)} className="rounded-lg border px-2.5 py-1.5">Edit</button></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
