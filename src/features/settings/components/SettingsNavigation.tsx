// ============================================================
// Bhatta Khata Pro - Settings Navigation
// ============================================================

import {
  Building2,
  Palette,
  Languages,
  Printer,
  SlidersHorizontal,
  BrickWall,
  Wallet,
  Truck,
  Flame,
  Users,
  LifeBuoy,
  KeyRound,
} from "lucide-react";

import { SETTINGS_NAVIGATION } from "../settings.constants";
import { useAppStore } from "../../../app/store";
import { translateTextNode } from "../../../lib/i18n";

interface SettingsNavigationProps {
  activeSection: string;
  onSelect: (section: string) => void;
}

const icons: Record<string, any> = {
  business: Building2,
  expenses: Wallet,
  drivers: Truck,
  "fuel-types": Flame,
  "labour-rules": Users,
  "brick-grades": BrickWall,
  printer: Printer,
  appearance: Palette,
  language: Languages,
  general: SlidersHorizontal,
  security: KeyRound,
  support: LifeBuoy,
};

export default function SettingsNavigation({
  activeSection,
  onSelect,
}: SettingsNavigationProps) {
  const language = useAppStore((state) => state.language);

  return (
    <nav
      aria-label="Settings sections"
      className="space-y-1 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900"
    >
      {SETTINGS_NAVIGATION.map((item) => {
        const Icon = icons[item.id] || SlidersHorizontal;
        const selected = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={selected ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl p-3 text-start transition ${
              selected
                ? "bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon size={19} className="shrink-0 text-indigo-600 dark:text-indigo-400" />

            <span className="min-w-0">
              <span className="block text-sm font-bold">
                {translateTextNode(item.label, language)}
              </span>

              <span className="mt-0.5 block text-xs leading-4 text-slate-500 dark:text-slate-400">
                {translateTextNode(item.description, language)}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
