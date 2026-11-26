import { useCallback, useEffect, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { Download, Mail, RefreshCw, RotateCw } from "lucide-react";
import { exportDiagnosticFile, getRecentErrors, getSystemInfo } from "../../../lib/api";
import { reportIssueViaEmail } from "../../../lib/diagnostics";

export default function SupportUpdatesSettings() {
  const [logs, setLogs] = useState<string[]>([]);
  const [appVersion, setAppVersion] = useState("");
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [working, setWorking] = useState(false);
  const [availableUpdate, setAvailableUpdate] = useState<Awaited<ReturnType<typeof check>>>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const refreshLogs = useCallback(async () => {
    setLoadingLogs(true);
    setError("");
    try {
      const [recent, info] = await Promise.all([getRecentErrors(100), getSystemInfo()]);
      setLogs(recent);
      setAppVersion(info.app_version);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => { void refreshLogs(); }, [refreshLogs]);

  async function handleExport() {
    setWorking(true);
    setError("");
    setStatus("");
    try {
      const path = await exportDiagnosticFile();
      setStatus(`Diagnostic report saved to: ${path}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setWorking(false);
    }
  }

  async function handleUpdateCheck() {
    setWorking(true);
    setAvailableUpdate(null);
    setError("");
    setStatus("");
    try {
      if (!isTauri()) throw new Error("Update checks are available in the installed desktop app.");
      const update = await check();
      setAvailableUpdate(update);
      if (!update) {
        setStatus(appVersion ? `You are using the latest version (${appVersion}).` : "You are using the latest version.");
        return;
      }
      setStatus(`Version ${update.version} is available. Install it when you are ready.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setWorking(false);
    }
  }

  async function handleUpdateInstall() {
    if (!availableUpdate) return;
    setWorking(true);
    setError("");
    setStatus(`Downloading version ${availableUpdate.version}…`);
    try {
      await availableUpdate.downloadAndInstall();
      setStatus("Update installed. Restarting the app…");
      await relaunch();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Software updates</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {appVersion ? `Installed version ${appVersion}. ` : ""}Checks the configured signed release channel.
          </p>
        </div>
        <button type="button" onClick={() => void handleUpdateCheck()} disabled={working}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          <RotateCw size={16} className={working ? "animate-spin" : ""} /> Check for updates
        </button>
        {availableUpdate && <button type="button" onClick={() => void handleUpdateInstall()} disabled={working}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-300 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950/50">
          <Download size={16} /> Install {availableUpdate.version}
        </button>}
      </div>

      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent application errors</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The latest 100 local log entries. Reports include app metadata and recent log text; review them before sharing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void refreshLogs()} disabled={loadingLogs || working}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
              <RefreshCw size={15} className={loadingLogs ? "animate-spin" : ""} /> Refresh
            </button>
            <button type="button" onClick={() => void handleExport()} disabled={working}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
              <Download size={15} /> Export report
            </button>
            <button type="button" onClick={() => void reportIssueViaEmail()} disabled={working}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
              <Mail size={15} /> Email support
            </button>
          </div>
        </div>
        <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-200">
          {loadingLogs ? "Loading recent logs…" : logs.length ? logs.join("\n") : "No local errors have been logged."}
        </pre>
      </div>

      {status && <p role="status" className="break-words rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{status}</p>}
      {error && <p role="alert" className="break-words rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    </div>
  );
}
