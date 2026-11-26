// FILE: src/features/backup-restore/BackupRestorePage.tsx
import { useEffect, useState } from "react";
import { DatabaseBackup, Download, Archive, RotateCcw, RefreshCw } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  createBackup,
  listBackups,
  restoreBackup,
  archiveOldRecords,
  type BackupInfo,
} from "../../lib/api";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(createdAt: string) {
  if (createdAt.startsWith("unix:")) {
    return new Date(Number(createdAt.slice(5)) * 1000).toLocaleString();
  }
  const d = new Date(createdAt.replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime()) ? createdAt : d.toLocaleString();
}

export default function BackupRestorePage() {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [cutoffDate, setCutoffDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  });

  async function load() {
    setLoading(true);
    try {
      setBackups(await listBackups());
    } catch (err) {
      setMessage({ text: String(err), ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate() {
    setBusy("create");
    setMessage(null);
    try {
      const backup = await createBackup();
      setMessage({ text: `Backup created: ${backup.name} (${formatSize(backup.size_bytes)})`, ok: true });
      await load();
    } catch (err) {
      setMessage({ text: String(err), ok: false });
    } finally {
      setBusy(null);
    }
  }

  async function handleRestore(name: string) {
    if (!window.confirm(`Restore backup "${name}"?\n\nThis replaces ALL current data. The app will need a restart.`)) return;
    setBusy(`restore:${name}`);
    setMessage(null);
    try {
      const result = await restoreBackup(name);
      setMessage({ text: result, ok: true });
    } catch (err) {
      setMessage({ text: String(err), ok: false });
    } finally {
      setBusy(null);
    }
  }

  async function handleArchive() {
    if (!window.confirm(`Move all finalized records older than ${cutoffDate} into a cold archive file?\n\nCurrent stock, customers, suppliers, workers and settings are NOT touched.`)) return;
    setBusy("archive");
    setMessage(null);
    try {
      const result = await archiveOldRecords(cutoffDate);
      setMessage({ text: result, ok: true });
    } catch (err) {
      setMessage({ text: String(err), ok: false });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Backup & Restore"
        description="Create safe database snapshots, restore them, and archive old records."
      />

      {message && (
        <div className={`rounded-xl border p-4 text-sm ${message.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"}`}>
          {message.text}
        </div>
      )}

      {/* Create backup */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Database Backup</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Creates a clean snapshot (VACUUM INTO) in the app's backups folder — safe while the app is running.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => void handleCreate()}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <DatabaseBackup size={16} />
              {busy === "create" ? "Creating..." : "Create Backup Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Backup list */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Saved Backups</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : backups.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No backups yet. Click "Create Backup Now" to make your first snapshot.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-700">
                  <th className="py-2 pr-4">Backup file</th>
                  <th className="py-2 pr-4">Size</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => (
                  <tr key={b.name} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">{b.name}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-400">{formatSize(b.size_bytes)}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-400">{formatDate(b.created_at)}</td>
                    <td className="py-2.5">
                      <button
                        onClick={() => void handleRestore(b.name)}
                        disabled={busy !== null}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/40"
                      >
                        <RotateCcw size={13} />
                        {busy === `restore:${b.name}` ? "Restoring..." : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Archive old records */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
            <Archive size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">Archive Old Records</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Moves finalized history (settled sales, completed orders, delivered gate passes, paid invoices/wages, old expenses, attendance, audit logs) older than the cutoff into a separate cold archive file — keeping daily screens fast. Master data and current stock are never touched.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-600 dark:text-slate-400">Older than:</label>
              <input
                type="date"
                value={cutoffDate}
                onChange={(e) => setCutoffDate(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={() => void handleArchive()}
                disabled={busy !== null || !cutoffDate}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                <Download size={16} />
                {busy === "archive" ? "Archiving..." : "Run Archive"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
