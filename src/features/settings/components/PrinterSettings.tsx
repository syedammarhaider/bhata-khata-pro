// ============================================================
// FILE 119
// PATH: E:\BRICKSCS\src\features\settings\components\PrinterSettings.tsx
// ============================================================

import { Printer, Info } from "lucide-react";
import { useState } from "react";

import { PRINTER_PAPER_OPTIONS } from "../settings.constants";
import type { PrinterSettings as PrinterSettingsType } from "../settings.types";

interface PrinterSettingsProps {
  settings: PrinterSettingsType;
  onChange: (settings: PrinterSettingsType) => void;
  onSave?: () => void;
}

export default function PrinterSettings({
  settings,
  onChange,
  onSave,
}: PrinterSettingsProps) {
  const [printerName, setPrinterName] = useState(settings.printer_name);

  function update<K extends keyof PrinterSettingsType>(
    key: K,
    value: PrinterSettingsType[K],
  ) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
          Printing preferences
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure the preferred printer and document paper size.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Printer name
        </label>

        <input
          value={printerName}
          onChange={(event) => {
            setPrinterName(event.target.value);
            update("printer_name", event.target.value);
          }}
          placeholder="Enter installed printer name"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Paper size
        </label>

        <select
          value={settings.paper_size}
          onChange={(event) =>
            update(
              "paper_size",
              event.target.value as PrinterSettingsType["paper_size"],
            )
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {PRINTER_PAPER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Number of copies
        </label>

        <input
          type="number"
          min={1}
          max={5}
          value={settings.copies}
          onChange={(event) =>
            update(
              "copies",
              Math.min(5, Math.max(1, Number(event.target.value) || 1)),
            )
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <Printer size={18} />
          Enable automatic printing
        </span>

        <input
          type="checkbox"
          checked={settings.auto_print}
          onChange={(event) => update("auto_print", event.target.checked)}
          className="h-4 w-4 accent-indigo-600"
        />
      </label>

      <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          These are printer preferences only. Actual printer discovery,
          test printing and print-job handling will be implemented through
          the desktop printing service.
        </p>
      </div>
      {onSave && (
        <div className="flex justify-end">
          <button type="button" onClick={onSave} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
            Save printer settings
          </button>
        </div>
      )}
    </div>
  );
}
