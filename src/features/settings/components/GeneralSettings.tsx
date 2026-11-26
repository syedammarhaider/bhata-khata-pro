// ============================================================
// FILE 120
// PATH: E:\BRICKSCS\src\features\settings\components\GeneralSettings.tsx
// ============================================================

import { useState } from "react";
import { Save } from "lucide-react";
import type { GeneralSettings as GeneralSettingsType } from "../settings.types";

interface GeneralSettingsProps {
  settings: GeneralSettingsType;
  onChange: (settings: GeneralSettingsType) => void;
  onSave?: () => void;
}

export default function GeneralSettings({
  settings,
  onChange,
  onSave,
}: GeneralSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  function update<K extends keyof GeneralSettingsType>(
    key: K,
    value: GeneralSettingsType[K],
  ) {
    const next = {
      ...localSettings,
      [key]: value,
    };

    setLocalSettings(next);
    onChange(next);
  }

  const toggles: {
    key: keyof GeneralSettingsType;
    label: string;
    description: string;
  }[] = [
    {
      key: "low_stock_alert",
      label: "Low stock alerts",
      description: "Show alerts when brick stock reaches its configured limit.",
    },
    {
      key: "backup_reminder",
      label: "Backup reminders",
      description: "Remind the administrator to create database backups.",
    },
    {
      key: "confirm_before_delete",
      label: "Confirm before deletion",
      description: "Ask for confirmation before supported delete operations.",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
          General preferences
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure common application behaviour.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Date format
        </label>

        <select
          value={localSettings.business_date_format}
          onChange={(event) =>
            update("business_date_format", event.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        </select>
      </div>

      <div className="space-y-3">
        {toggles.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
          >
            <span>
              <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {item.label}
              </span>

              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                {item.description}
              </span>
            </span>

            <input
              type="checkbox"
              checked={Boolean(localSettings[item.key])}
              onChange={(event) =>
                update(item.key, event.target.checked)
              }
              className="h-4 w-4 shrink-0 accent-indigo-600"
            />
          </label>
        ))}
      </div>

      {onSave && (
        <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Save size={16} />
            Save preferences
          </button>
        </div>
      )}
    </div>
  );
}
