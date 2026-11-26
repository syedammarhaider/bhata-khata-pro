// ============================================================
// Bhatta Khata Pro - Settings Page
// Business, Expenses, Drivers, Fuels, Labour Policy, Grades
// ============================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAppStore } from "../../app/store";
import {
  Settings,
  Building2,
  Palette,
  Languages,
  Printer,
  SlidersHorizontal,
  Wallet,
  Truck,
  Flame,
  Users,
  BrickWall,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import SettingsSection from "./components/SettingsSection";
import SettingsNavigation from "./components/SettingsNavigation";
import AppearanceSettings from "./components/AppearanceSettings";
import LanguageSettings from "./components/LanguageSettings";
import PrinterSettings from "./components/PrinterSettings";
import GeneralSettings from "./components/GeneralSettings";
import BrickGradesSettings from "./components/BrickGradesSettings";
import ExpenseCategoriesSettings from "./components/ExpenseCategoriesSettings";
import DriversSettings from "./components/DriversSettings";
import FuelTypesSettings from "./components/FuelTypesSettings";
import LabourPolicySettings from "./components/LabourPolicySettings";
import SupportUpdatesSettings from "./components/SupportUpdatesSettings";

import type {
  GeneralSettings as GeneralSettingsType,
  PrinterSettings as PrinterSettingsType,
} from "./settings.types";

const defaultPrinterSettings: PrinterSettingsType = {
  printer_name: "",
  paper_size: "A4",
  auto_print: false,
  copies: 1,
};

const defaultGeneralSettings: GeneralSettingsType = {
  business_date_format: "DD/MM/YYYY",
  number_format: "en-PK",
  currency_symbol: "PKR",
  low_stock_alert: true,
  backup_reminder: true,
  confirm_before_delete: true,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("expenses");

  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const [printerSettings, setPrinterSettings] =
    useState<PrinterSettingsType>(defaultPrinterSettings);

  const [generalSettings, setGeneralSettings] =
    useState<GeneralSettingsType>(defaultGeneralSettings);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings");
        const values = new Map(settings.map((item) => [item.setting_key, item.setting_value]));
        setPrinterSettings({
          printer_name: values.get("printer_name") || "",
          paper_size: (values.get("paper_size") as PrinterSettingsType["paper_size"]) || "A4",
          auto_print: values.get("auto_print") === "true",
          copies: Number(values.get("copies") || 1),
        });
        setGeneralSettings({
          business_date_format: values.get("business_date_format") || "DD/MM/YYYY",
          number_format: values.get("number_format") || "en-PK",
          currency_symbol: values.get("currency_symbol") || "PKR",
          low_stock_alert: values.get("low_stock_alert") !== "false",
          backup_reminder: values.get("backup_reminder") !== "false",
          confirm_before_delete: values.get("confirm_before_delete") !== "false",
        });
      } catch (err) {
        setError(String(err));
      }
    }
    void loadSettings();
  }, []);

  async function handleSave() {
    setMessage("");
    setError("");
    const settings = [
      ["business_date_format", generalSettings.business_date_format],
      ["number_format", generalSettings.number_format],
      ["currency_symbol", generalSettings.currency_symbol],
      ["low_stock_alert", String(generalSettings.low_stock_alert)],
      ["backup_reminder", String(generalSettings.backup_reminder)],
      ["confirm_before_delete", String(generalSettings.confirm_before_delete)],
      ["printer_name", printerSettings.printer_name],
      ["paper_size", printerSettings.paper_size],
      ["auto_print", String(printerSettings.auto_print)],
      ["copies", String(printerSettings.copies)],
    ].map(([setting_key, setting_value]) => ({ setting_key, setting_value }));

    try {
      await invoke("save_app_settings", { settings });
      setMessage("Settings saved to the local database.");
    } catch (err) {
      setError(String(err));
    }
  }

  function renderSection() {
    switch (activeSection) {
      case "expenses":
        return (
          <SettingsSection
            title="Expense Categories"
            description="Add, edit or remove categories like food, personal fuel, maintenance, tea, etc."
            icon={<Wallet size={19} />}
          >
            <ExpenseCategoriesSettings />
          </SettingsSection>
        );

      case "drivers":
        return (
          <SettingsSection
            title="Delivery Driver Fleet"
            description="Manage drivers, assigned vehicles, and availability schedules."
            icon={<Truck size={19} />}
          >
            <DriversSettings />
          </SettingsSection>
        );

      case "fuel-types":
        return (
          <SettingsSection
            title="Coal & Kiln Fuel Materials"
            description="Manage fuel types used for brick burning and baking."
            icon={<Flame size={19} />}
          >
            <FuelTypesSettings />
          </SettingsSection>
        );

      case "labour-rules":
        return (
          <SettingsSection
            title="Labour Shift & Leave Policy"
            description="Set standard daily hours and monthly allowed leaves with no wage deduction."
            icon={<Users size={19} />}
          >
            <LabourPolicySettings />
          </SettingsSection>
        );

      case "appearance":
        return (
          <SettingsSection
            title="Appearance"
            description="Choose your preferred application appearance."
            icon={<Palette size={19} />}
          >
            <AppearanceSettings
              theme={theme}
              onChange={setTheme}
            />
          </SettingsSection>
        );

      case "language":
        return (
          <SettingsSection
            title="Language & Urdu Nastaleeq"
            description="Choose between Urdu (Jameel Noori Nastaleeq) and English."
            icon={<Languages size={19} />}
          >
            <LanguageSettings
              language={language}
              onChange={setLanguage}
            />
          </SettingsSection>
        );

      case "printer":
        return (
          <SettingsSection
            title="Printer settings"
            description="Configure invoice, receipt and voucher printing."
            icon={<Printer size={19} />}
          >
            <PrinterSettings
              settings={printerSettings}
              onChange={setPrinterSettings}
              onSave={handleSave}
            />
          </SettingsSection>
        );

      case "general":
        return (
          <SettingsSection
            title="General settings"
            description="Configure application preferences."
            icon={<SlidersHorizontal size={19} />}
          >
            <GeneralSettings
              settings={generalSettings}
              onChange={setGeneralSettings}
              onSave={handleSave}
            />
          </SettingsSection>
        );

      case "support":
        return (
          <SettingsSection
            title="Support & software updates"
            description="Review recent app errors, export a diagnostic report for support, or check for a signed update."
            icon={<Settings size={19} />}
          >
            <SupportUpdatesSettings />
          </SettingsSection>
        );

      case "brick-grades":
        return (
          <SettingsSection
            title="Brick grades"
            description="Create and manage grade names, prices and defaults."
            icon={<BrickWall size={19} />}
          >
            <BrickGradesSettings />
          </SettingsSection>
        );

      case "business":
        return (
          <SettingsSection
            title="Business profile"
            description="Kiln business name, address, owner details, and currency."
            icon={<Building2 size={19} />}
          >
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Your business name, owner details, phone number, address,
              currency and language are stored in the local business
              profile database.
            </p>
          </SettingsSection>
        );

      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Kiln Configuration"
        description="Manage business profile, drivers, fuels, expense categories, labour policies, and printer preferences."
        icon={Settings}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <SettingsNavigation
          activeSection={activeSection}
          onSelect={setActiveSection}
        />

        <div className="min-w-0 space-y-4">
          {renderSection()}

          {message && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
            >
              {message}
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
