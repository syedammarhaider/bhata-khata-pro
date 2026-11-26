// FILE 534: src/features/audit-history/AuditHistoryPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import { getAuditLogs } from "../../lib/api";
import type { AuditLog } from "../../lib/api";

interface AuditRow {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  recordId: string;
  details: string;
}

export default function AuditHistoryPage() {
  const [records, setRecords] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuditLogs(200);
        setRecords(
          (data as AuditLog[]).map((log) => ({
            id: String(log.id),
            time: log.created_at,
            user: log.username,
            action: log.action,
            module: log.module,
            recordId: log.record_id ? String(log.record_id) : "—",
            details: log.new_values || log.old_values || "—",
          })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((r) =>
      [r.user, r.action, r.module, r.details, r.recordId].some((v) =>
        v.toLowerCase().includes(term),
      ),
    );
  }, [records, search]);

  return (
    <section className="space-y-6">
      <PageHeader title="Audit History" description="Track all user activities, edits, deletions and cancellations." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search audit logs..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No audit events yet" description="Manager and admin activities will be recorded here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Time</th><th className="p-3">User</th><th className="p-3">Action</th><th className="p-3">Module</th><th className="p-3">Record</th><th className="p-3">Details</th></tr></thead>
              <tbody>{visible.map((record) => (
                <tr key={record.id} className="border-b last:border-0">
                  <td className="p-3 text-xs whitespace-nowrap">{record.time}</td>
                  <td className="p-3 font-medium">{record.user}</td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                      record.action === "delete" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" :
                      record.action === "update" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" :
                      record.action === "create" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    }`}>{record.action}</span>
                  </td>
                  <td className="p-3 capitalize">{record.module}</td>
                  <td className="p-3">{record.recordId}</td>
                  <td className="p-3 text-xs text-slate-500 max-w-xs truncate">{record.details}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
