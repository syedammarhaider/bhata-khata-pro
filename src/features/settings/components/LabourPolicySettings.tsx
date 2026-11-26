// ============================================================
// Bhatta Khata Pro - Labour & Attendance Policy Settings
// Standard Shift Hours and Monthly Allowed Leaves (No deduction)
// ============================================================

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle2 } from "lucide-react";

export default function LabourPolicySettings() {
  const [standardHours, setStandardHours] = useState(8);
  const [allowedLeaves, setAllowedLeaves] = useState(4);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings")
      .then((settings) => {
        const foundH = settings.find((s) => s.setting_key === "labour_standard_hours");
        if (foundH) setStandardHours(Number(foundH.setting_value) || 8);
        const foundL = settings.find((s) => s.setting_key === "labour_allowed_leaves");
        if (foundL) setAllowedLeaves(Number(foundL.setting_value) || 4);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setError("");
    try {
      await invoke("save_app_settings", {
        settings: [
          { setting_key: "labour_standard_hours", setting_value: String(standardHours) },
          { setting_key: "labour_allowed_leaves", setting_value: String(allowedLeaves) },
        ],
      });
      setSavedMsg("Labour policy settings saved successfully.");
      setTimeout(() => setSavedMsg(""), 3500);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Workforce Attendance & Salary Policy
          </h3>
          <p className="text-xs text-slate-500">
            Configure default working shift hours and monthly allowed off-days. Used by the automatic wage calculator to compute exact salaries without manual math.
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

        <div className="space-y-4 max-w-md">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Standard Daily Working Hours
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="4"
                max="16"
                step="1"
                value={standardHours}
                onChange={(e) => setStandardHours(Number(e.target.value))}
                className="w-32 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-xs text-slate-500">Hours / Shift (Default: 8 hours)</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Used to calculate hourly rates and partial shift deductions.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Allowed Paid Leaves per Month (No Salary Deduction)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="15"
                step="1"
                value={allowedLeaves}
                onChange={(e) => setAllowedLeaves(Number(e.target.value))}
                className="w-32 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-xs text-slate-500">Days / Month (Default: 4 off-days)</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              When a worker takes up to this many off-days, their salary is NOT deducted. Only absences exceeding this quota will incur wage deductions.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
            >
              <CheckCircle2 size={16} /> Save Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
