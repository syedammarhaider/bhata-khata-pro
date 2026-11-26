// ============================================================
// FILE 117
// PATH: E:\BRICKSCS\src\features\settings\components\AppearanceSettings.tsx
// ============================================================

import { Monitor, Moon, Sun } from "lucide-react";
import type { AppTheme } from "../settings.types";
import { THEME_OPTIONS } from "../settings.constants";

interface AppearanceSettingsProps {
  theme: AppTheme;
  onChange: (theme: AppTheme) => void;
}

const themeIcons = {
  light: <Sun size={20} />,
  dark: <Moon size={20} />,
  system: <Monitor size={20} />,
};

export default function AppearanceSettings({
  theme,
  onChange,
}: AppearanceSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
          Application theme
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose how Bhatta Khata Pro appears on your computer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {THEME_OPTIONS.map((option) => {
          const selected = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {themeIcons[option.value]}

              <span className="text-sm font-medium">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
