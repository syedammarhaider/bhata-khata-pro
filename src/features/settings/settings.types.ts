// ============================================================
// FILE 108
// PATH: E:\BRICKSCS\src\features\settings\settings.types.ts
// ============================================================

export interface BusinessProfile {
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  language: string;
}

export type AppTheme = "light" | "dark" | "system";

export type AppLanguage = "en" | "ur" | "both";

export interface PrinterSettings {
  printer_name: string;
  paper_size: "A4" | "A5" | "thermal_58" | "thermal_80";
  auto_print: boolean;
  copies: number;
}

export interface GeneralSettings {
  business_date_format: string;
  number_format: string;
  currency_symbol: string;
  low_stock_alert: boolean;
  backup_reminder: boolean;
  confirm_before_delete: boolean;
}

export interface AdminSetup {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SettingsNavigationItem {
  id: string;
  label: string;
  description: string;
}

export interface BrickGrade {
  id: number;
  name: string;
  description: string;
  selling_price: number;
  purchase_rate: number;
  is_active: boolean;
  is_default: boolean;
}
