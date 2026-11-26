// ============================================================
// FILE 115
// PATH: E:\BRICKSCS\src\features\settings\components\SettingsSection.tsx
// ============================================================

import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
  icon,
}: SettingsSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        {icon && (
          <span className="mt-0.5 text-indigo-600 dark:text-indigo-400">
            {icon}
          </span>
        )}

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}
