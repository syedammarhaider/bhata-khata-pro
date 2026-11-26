// ============================================================
// Bhatta Khata Pro - Settings Constants
// ============================================================

import type {
  AppLanguage,
  AppTheme,
  SettingsNavigationItem,
} from "./settings.types";

export const DEFAULT_BUSINESS_PROFILE = {
  business_name: "",
  owner_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "Pakistan",
  currency: "PKR",
  language: "en",
};

export const THEME_OPTIONS: {
  value: AppTheme;
  label: string;
}[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System default" },
];

export const LANGUAGE_OPTIONS: {
  value: AppLanguage;
  label: string;
}[] = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu (اردو)" },
];

export const CURRENCY_OPTIONS = [
  { value: "PKR", label: "Pakistani Rupee (PKR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "SAR", label: "Saudi Riyal (SAR)" },
  { value: "AED", label: "UAE Dirham (AED)" },
];

export const PRINTER_PAPER_OPTIONS = [
  { value: "A4", label: "A4 standard paper" },
  { value: "A5", label: "A5 paper" },
  { value: "thermal_58", label: "58mm thermal receipt" },
  { value: "thermal_80", label: "80mm thermal receipt" },
];

export const SETTINGS_NAVIGATION: SettingsNavigationItem[] = [
  {
    id: "business",
    label: "Business profile",
    description: "Kiln identity and contact details",
  },
  {
    id: "expenses",
    label: "Expense Categories",
    description: "Manage categories: food, personal fuel, maintenance",
  },
  {
    id: "drivers",
    label: "Delivery Drivers",
    description: "Driver names, vehicles, and live availability",
  },
  {
    id: "fuel-types",
    label: "Coal & Fuel Types",
    description: "Kiln fuel materials: coal, gas, wood, husk",
  },
  {
    id: "labour-rules",
    label: "Labour & Salary Policy",
    description: "Daily shift hours and allowed monthly leaves",
  },
  {
    id: "brick-grades",
    label: "Brick grades",
    description: "Grades, prices and default grade",
  },
  {
    id: "printer",
    label: "Printer",
    description: "Receipt and invoice printing preferences",
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme and display preferences",
  },
  {
    id: "language",
    label: "Language",
    description: "Urdu (Jameel Noori) & English typography",
  },
  {
    id: "general",
    label: "General",
    description: "General application preferences",
  },
];

export const DEFAULT_THEME: AppTheme = "light";
export const DEFAULT_LANGUAGE: AppLanguage = "en";
