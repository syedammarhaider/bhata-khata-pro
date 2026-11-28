// ============================================================
// Bhatta Khata Pro - Language & Urdu Nastaleeq Settings
// ============================================================

import { Languages, CheckCircle2 } from "lucide-react";
import type { AppLanguage } from "../settings.types";
import { LANGUAGE_OPTIONS } from "../settings.constants";
import { translateTextNode } from "../../../lib/i18n";

interface LanguageSettingsProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
}

export default function LanguageSettings({
  language,
  onChange,
}: LanguageSettingsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {translateTextNode("Application Language & Typography", language)}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {translateTextNode("Choose English, Urdu, or both. Urdu text uses Jameel Noori Nastaleeq.", language)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {LANGUAGE_OPTIONS.map((option) => {
          const selected = language === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                selected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Languages size={17} className="shrink-0" />
              <span className="text-start">{translateTextNode(option.label, language)}</span>
              {selected && <CheckCircle2 size={16} className="text-indigo-600 ms-1 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Urdu Font Preview Box */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
          {translateTextNode("Urdu Nastaleeq Typography Preview", language)}
        </h4>
        <div className="space-y-1 text-right text-lg text-slate-800 dark:text-slate-100">
          <p dir="rtl">{translateTextNode("Urdu sample text is shown here.", language)}</p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {translateTextNode("Daily record of firing, loading, sorting, and dispatch with attendance and wages.", language)}
          </p>
        </div>
      </div>
    </div>
  );
}
