// ============================================================
// Bhatta Khata Pro - Language & Urdu Nastaleeq Settings
// ============================================================

import { Languages, CheckCircle2 } from "lucide-react";
import type { AppLanguage } from "../settings.types";
import { LANGUAGE_OPTIONS } from "../settings.constants";

interface LanguageSettingsProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
}

export default function LanguageSettings({
  language,
  onChange,
}: LanguageSettingsProps) {
  const handleSelect = (lang: AppLanguage) => {
    onChange(lang);
    if (lang === "ur") {
      document.documentElement.setAttribute("lang", "ur");
      document.documentElement.classList.add("font-urdu");
    } else {
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.classList.remove("font-urdu");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Application Language & Typography
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Select between English and Urdu. Urdu uses genuine Jameel Noori Nastaleeq calligraphy font for authentic brick kiln records and slips.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {LANGUAGE_OPTIONS.map((option) => {
          const selected = language === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                selected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Languages size={17} />
              {option.label}
              {selected && <CheckCircle2 size={16} className="text-indigo-600 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Urdu Font Preview Box */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 mb-2">
          Urdu Nastaleeq Typography Preview (جمیل نوری نستعلیق فونٹ)
        </h4>
        <div className="font-urdu text-right text-lg text-slate-800 dark:text-slate-100 space-y-1">
          <p>بھٹہ کھاتہ پرو &bull; اینٹوں کے بھٹہ کا مکمل کمپیوٹرائزڈ کھاتہ اور حساب کتاب</p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            پتھائی، بھرائی، جلائی اور نکاسی کا روزانہ ریکارڈ اور مزدوروں کی حاضری اور اجرت کی ادائیگی۔
          </p>
        </div>
      </div>
    </div>
  );
}
