/* ============================================================
   BHATTA KHATA PRO
   Global Application Types
   Version: 1.0.0
   Platform: Tauri 2 + React + TypeScript + SQLite
   ============================================================ */

/* ===================== CORE TYPES ===================== */

export type ID = number;
export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export type CurrencyCode = "PKR" | "USD" | "SAR" | "AED";
export type LanguageCode = "en" | "ur";

export type RecordStatus =
  | "active"
  | "inactive"
  | "archived";

export type TransactionStatus =
  | "draft"
  | "pending"
  | "completed"
  | "cancelled"
  | "voided"
  | "reversed";

export type PaymentMethod =
  | "cash"
  | "bank"
  | "cheque"
  | "online"
  | "other";

export type PaymentDirection =
  | "received"
  | "paid";

export interface BaseEntity {
  id: ID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface SoftDeleteEntity extends BaseEntity {
  deleted_at?: ISODateTime | null;
  deleted_by?: ID | null;
}

/* ===================== BUSINESS PROFILE ===================== */

export interface BusinessProfile {
  id?: ID;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: CurrencyCode;
  language: LanguageCode;
  logo_path?: string | null;
  tax_number?: string | null;
  registration_number?: string | null;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
}

export interface BusinessSettings {
  date_format: string;
  time_format: "12h" | "24h";
  timezone: string;
  decimal_places: number;
  currency_symbol: string;
  default_payment_method: PaymentMethod;
  low_stock_alert: boolean;
  negative_stock_allowed: boolean;
  financial_year_start: string;
  backup_reminder: boolean;
}

/* ===================== AUTHENTICATION ===================== */

export type UserRole =
  | "admin"
  | "manager";

export interface User extends BaseEntity {
  full_name: string;
  username: string;
  password_hash?: string;
  role: UserRole;
  phone?: string;
  email?: string;
  is_active: boolean;
  last_login?: ISODateTime | null;
  profile_image?: string | null;
}

export interface AuthSession {
  user_id: ID;
  username: string;
  full_name: string;
  role: UserRole;
  authenticated_at: ISODateTime;
  expires_at?: ISODateTime;
}

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "print"
  | "export";

export type PermissionModule =
  | "dashboard"
  | "production"
  | "inventory"
  | "sales"
  | "orders"
  | "invoices"
  | "gate_pass"
  | "returns"
  | "customers"
  | "suppliers"
  | "payments"
  | "cashbook"
  | "labour"
  | "attendance"
  | "wages"
  | "coal_fuel"
  | "transport"
  | "expenses"
  | "purchases"
  | "reports"
  | "analytics"
  | "users"
  | "settings"
  | "customization"
  | "audit_history"
  | "backup_restore"
  | "admin";

export interface RolePermission {
  id?: ID;
  role: UserRole;
  module: PermissionModule;
  actions: PermissionAction[];
  can_view_profit_loss: boolean;
  can_view_sensitive_financials: boolean;
}

/* ===================== DASHBOARD ===================== */

export interface DashboardSummary {
  today_production: number;
  total_stock: number;
  today_sales: number;
  monthly_sales: number;
  outstanding_receivables: number;
  outstanding_payables: number;
  total_expenses: number;
  total_workers: number;
  present_workers: number;
}

export interface DashboardKPI {
  title: string;
  value: number;
  previous_value?: number;
  change_percentage?: number;
  description?: string;
  unit?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary_value?: number;
}

export interface DashboardActivity {
  id: ID;
  activity_type: string;
  description: string;
  reference_number?: string;
  amount?: number;
  created_at: ISODateTime;
  created_by?: string;
}

/* ===================== BRICK GRADES ===================== */

export interface BrickGrade extends BaseEntity {
  grade_name: string;
  grade_code: string;
  description?: string;
  selling_price: number;
  production_cost?: number;
  is_active: boolean;
  sort_order: number;
}

export interface BrickPricing {
  grade_id: ID;
  price_per_brick: number;
  effective_from: ISODate;
  effective_to?: ISODate | null;
}

/* ===================== PRODUCTION ===================== */

export type ProductionStage =
  | "pathai"
  | "bhari"
  | "nikasi";

export type ProductionBatchStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ProductionBatch extends BaseEntity {
  batch_number: string;
  batch_name?: string;
  start_date: ISODate;
  completion_date?: ISODate | null;
  status: ProductionBatchStatus;
  total_bricks: number;
  good_bricks: number;
  damaged_bricks: number;
  notes?: string;
}

export interface ProductionEntry extends BaseEntity {
  entry_number: string;
  batch_id?: ID | null;
  stage: ProductionStage;
  grade_id: ID;
  quantity: number;
  production_date: ISODate;
  worker_id?: ID | null;
  labour_rate?: number;
  labour_cost?: number;
  notes?: string;
  status: TransactionStatus;
}

export interface ProductionSummary {
  pathai_quantity: number;
  bhari_quantity: number;
  nikasi_quantity: number;
  total_good_bricks: number;
  total_damaged_bricks: number;
  production_date: ISODate;
}

/* ===================== INVENTORY ===================== */

export interface InventoryItem extends BaseEntity {
  grade_id: ID;
  opening_stock: number;
  available_stock: number;
  reserved_stock: number;
  damaged_stock: number;
  minimum_stock: number;
  unit: "bricks";
}

export type StockMovementType =
  | "production_in"
  | "sales_out"
  | "return_in"
  | "damage_out"
  | "adjustment_in"
  | "adjustment_out"
  | "transfer";

export interface StockMovement extends BaseEntity {
  movement_number: string;
  grade_id: ID;
  movement_type: StockMovementType;
  quantity: number;
  reference_type?: string;
  reference_id?: ID;
  movement_date: ISODate;
  notes?: string;
  created_by: ID;
}

/* ===================== CUSTOMERS ===================== */

export interface Customer extends BaseEntity {
  customer_code: string;
  full_name: string;
  phone: string;
  alternate_phone?: string;
  email?: string;
  address?: string;
  city?: string;
  opening_balance: number;
  credit_limit?: number;
  current_balance: number;
  notes?: string;
  is_active: boolean;
}

export interface CustomerLedgerEntry extends BaseEntity {
  customer_id: ID;
  transaction_number: string;
  transaction_date: ISODate;
  transaction_type:
    | "opening_balance"
    | "sale"
    | "payment_received"
    | "sales_return"
    | "adjustment"
    | "reversal";
  description: string;
  debit: number;
  credit: number;
  running_balance: number;
  reference_type?: string;
  reference_id?: ID;
  status: TransactionStatus;
}

/* ===================== SUPPLIERS ===================== */

export interface Supplier extends BaseEntity {
  supplier_code: string;
  full_name: string;
  phone: string;
  alternate_phone?: string;
  email?: string;
  address?: string;
  city?: string;
  opening_balance: number;
  current_balance: number;
  notes?: string;
  is_active: boolean;
}

export interface SupplierLedgerEntry extends BaseEntity {
  supplier_id: ID;
  transaction_number: string;
  transaction_date: ISODate;
  transaction_type:
    | "opening_balance"
    | "purchase"
    | "payment_made"
    | "purchase_return"
    | "adjustment"
    | "reversal";
  description: string;
  debit: number;
  credit: number;
  running_balance: number;
  reference_type?: string;
  reference_id?: ID;
  status: TransactionStatus;
}

/* ===================== SALES & ORDERS ===================== */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "dispatched"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id?: ID;
  grade_id: ID;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
}

export interface SalesOrder extends BaseEntity {
  order_number: string;
  customer_id: ID;
  order_date: ISODate;
  delivery_date?: ISODate | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  advance_amount: number;
  remaining_amount: number;
  status: OrderStatus;
  notes?: string;
}

export interface Sale extends BaseEntity {
  sale_number: string;
  customer_id: ID;
  order_id?: ID | null;
  sale_date: ISODate;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: TransactionStatus;
}

/* ===================== INVOICES ===================== */

export interface Invoice extends BaseEntity {
  invoice_number: string;
  customer_id: ID;
  sale_id?: ID | null;
  invoice_date: ISODate;
  due_date?: ISODate | null;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: TransactionStatus;
  notes?: string;
}

/* ===================== GATE PASS & DISPATCH ===================== */

export interface GatePass extends BaseEntity {
  gate_pass_number: string;
  customer_id: ID;
  invoice_id?: ID | null;
  dispatch_date: ISODate;
  vehicle_id?: ID | null;
  driver_id?: ID | null;
  total_bricks: number;
  destination?: string;
  receiver_name?: string;
  notes?: string;
  status: TransactionStatus;
}

export interface GatePassItem {
  id?: ID;
  gate_pass_id: ID;
  grade_id: ID;
  quantity: number;
}

/* ===================== RETURNS ===================== */

export interface SalesReturn extends BaseEntity {
  return_number: string;
  customer_id: ID;
  invoice_id?: ID | null;
  return_date: ISODate;
  total_quantity: number;
  total_amount: number;
  reason: string;
  status: TransactionStatus;
}

/* ===================== PAYMENTS ===================== */

export interface Payment extends BaseEntity {
  payment_number: string;
  direction: PaymentDirection;
  payment_date: ISODate;
  payment_method: PaymentMethod;
  amount: number;
  party_type: "customer" | "supplier" | "other";
  party_id?: ID | null;
  reference_number?: string;
  description?: string;
  cashbook_entry_id?: ID | null;
  status: TransactionStatus;
  created_by: ID;
}

export interface PaymentAllocation {
  id?: ID;
  payment_id: ID;
  invoice_id?: ID | null;
  allocated_amount: number;
}

export interface PaymentLedgerSummary {
  original_amount: number;
  total_paid: number;
  remaining_balance: number;
  payment_count: number;
  last_payment_date?: ISODate | null;
}

/* ===================== CASHBOOK ===================== */

export interface CashbookEntry extends BaseEntity {
  entry_number: string;
  entry_date: ISODate;
  entry_type: "cash_in" | "cash_out";
  category: string;
  description: string;
  reference_type?: string;
  reference_id?: ID;
  amount: number;
  payment_method: PaymentMethod;
  balance_after: number;
  status: TransactionStatus;
}

/* ===================== LABOUR & WORKERS ===================== */

export type WorkerPaymentMode =
  | "daily"
  | "monthly"
  | "piece_rate";

export interface Worker extends BaseEntity {
  worker_code: string;
  full_name: string;
  phone?: string;
  address?: string;
  job_title: string;
  payment_mode: WorkerPaymentMode;
  daily_rate?: number;
  monthly_salary?: number;
  piece_rate?: number;
  joining_date: ISODate;
  is_active: boolean;
  notes?: string;
}

export interface Attendance extends BaseEntity {
  worker_id: ID;
  attendance_date: ISODate;
  status: "present" | "absent" | "half_day" | "leave";
  check_in?: string;
  check_out?: string;
  overtime_hours: number;
  notes?: string;
}

export interface WageEntry extends BaseEntity {
  worker_id: ID;
  wage_number: string;
  wage_period_start: ISODate;
  wage_period_end: ISODate;
  basic_amount: number;
  overtime_amount: number;
  deductions: number;
  advances: number;
  net_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: TransactionStatus;
}

export interface LabourSettlement extends BaseEntity {
  settlement_number: string;
  worker_id: ID;
  settlement_date: ISODate;
  amount: number;
  payment_method: PaymentMethod;
  description?: string;
  status: TransactionStatus;
}

/* ===================== COAL & FUEL ===================== */

export interface FuelItem extends BaseEntity {
  item_name: string;
  unit: "kg" | "ton" | "liter" | "bag" | "other";
  available_quantity: number;
  minimum_quantity: number;
  average_cost: number;
  is_active: boolean;
}

export interface FuelTransaction extends BaseEntity {
  fuel_item_id: ID;
  transaction_number: string;
  transaction_type: "purchase" | "consumption" | "adjustment";
  quantity: number;
  unit_cost: number;
  total_cost: number;
  transaction_date: ISODate;
  notes?: string;
}

/* ===================== TRANSPORT ===================== */

export interface Vehicle extends BaseEntity {
  vehicle_number: string;
  vehicle_type: string;
  capacity?: number;
  owner_name?: string;
  phone?: string;
  is_active: boolean;
}

export interface Driver extends BaseEntity {
  full_name: string;
  phone: string;
  license_number?: string;
  address?: string;
  is_active: boolean;
}

export interface TransportTrip extends BaseEntity {
  trip_number: string;
  vehicle_id: ID;
  driver_id: ID;
  trip_date: ISODate;
  origin: string;
  destination: string;
  quantity: number;
  transport_cost: number;
  fuel_cost: number;
  notes?: string;
  status: TransactionStatus;
}

/* ===================== EXPENSES & PURCHASES ===================== */

export interface Expense extends BaseEntity {
  expense_number: string;
  category: string;
  description: string;
  expense_date: ISODate;
  amount: number;
  payment_method: PaymentMethod;
  supplier_id?: ID | null;
  reference_number?: string;
  status: TransactionStatus;
}

export interface Purchase extends BaseEntity {
  purchase_number: string;
  supplier_id: ID;
  purchase_date: ISODate;
  subtotal: number;
  discount: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: TransactionStatus;
}

/* ===================== REPORTS & ANALYTICS ===================== */

export interface DateRange {
  start_date: ISODate;
  end_date: ISODate;
}

export interface ReportFilter extends DateRange {
  customer_id?: ID;
  supplier_id?: ID;
  worker_id?: ID;
  grade_id?: ID;
  status?: TransactionStatus;
}

export interface FinancialSummary {
  total_sales: number;
  total_purchases: number;
  total_expenses: number;
  total_received: number;
  total_paid: number;
  receivables: number;
  payables: number;
  gross_profit?: number;
  net_profit?: number;
}

export interface ProductionReport {
  total_pathai: number;
  total_bhari: number;
  total_nikasi: number;
  good_bricks: number;
  damaged_bricks: number;
  production_cost: number;
}

/* ===================== AUDIT HISTORY ===================== */

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "void"
  | "reverse"
  | "login"
  | "logout"
  | "restore"
  | "permission_change"
  | "settings_change";

export interface AuditLog extends BaseEntity {
  user_id?: ID | null;
  username: string;
  action: AuditAction;
  module: string;
  record_id?: ID | null;
  description: string;
  old_values?: string | null;
  new_values?: string | null;
  ip_address?: string | null;
}

/* ===================== BACKUP & RESTORE ===================== */

export interface BackupRecord {
  id: ID;
  file_name: string;
  file_path: string;
  file_size: number;
  backup_date: ISODateTime;
  backup_type: "manual" | "automatic";
  status: "completed" | "failed";
  checksum?: string;
}

export interface RestoreResult {
  success: boolean;
  message: string;
  restored_at?: ISODateTime;
}

/* ===================== CUSTOMIZATION ===================== */

export interface CustomField {
  id?: ID;
  module: PermissionModule;
  field_name: string;
  field_label: string;
  field_type:
    | "text"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "checkbox";
  is_required: boolean;
  is_visible: boolean;
  options?: string[];
  sort_order: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  widget_type:
    | "kpi"
    | "bar_chart"
    | "line_chart"
    | "pie_chart"
    | "table";
  is_visible: boolean;
  sort_order: number;
}

/* ===================== PRINTER & SETTINGS ===================== */

export interface PrinterSettings {
  printer_name: string;
  paper_size: "A4" | "A5" | "thermal_58mm" | "thermal_80mm";
  orientation: "portrait" | "landscape";
  show_logo: boolean;
  show_business_address: boolean;
  footer_text?: string;
  copies: number;
}

export interface NotificationSettings {
  low_stock: boolean;
  pending_payments: boolean;
  delayed_orders: boolean;
  backup_reminder: boolean;
  license_expiry: boolean;
}

/* ===================== LICENSING ===================== */

export type LicenseStatus =
  | "not_activated"
  | "active"
  | "expiring_soon"
  | "expired"
  | "suspended"
  | "invalid";

export interface LicenseInfo {
  license_id: string;
  customer_id: string;
  business_name: string;
  device_id: string;
  issued_at: ISODateTime;
  expires_at: ISODateTime;
  status: LicenseStatus;
  signature: string;
  plan_name: string;
}

export interface ActivationRequest {
  device_id: string;
  activation_code: string;
  business_name: string;
}

export interface LicenseValidation {
  valid: boolean;
  status: LicenseStatus;
  expires_at?: ISODateTime;
  days_remaining?: number;
  message: string;
}

/* ===================== OWNER APPLICATION ===================== */

export interface OwnerCustomer extends BaseEntity {
  customer_code: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  city?: string;
  device_id: string;
  license_id?: string;
  license_status: LicenseStatus;
  subscription_start?: ISODate;
  subscription_end?: ISODate;
}

export interface SubscriptionPayment extends BaseEntity {
  customer_id: ID;
  payment_number: string;
  payment_date: ISODate;
  amount: number;
  payment_method: PaymentMethod;
  subscription_period_start: ISODate;
  subscription_period_end: ISODate;
  reference_number?: string;
  status: TransactionStatus;
}

/* ===================== APPLICATION STATE ===================== */

export interface AppState {
  initialized: boolean;
  authenticated: boolean;
  current_user: User | null;
  business_profile: BusinessProfile | null;
  language: LanguageCode;
  theme: "light" | "dark" | "system";
  sidebar_collapsed: boolean;
}

/* ===================== API / SERVICE RESULTS ===================== */

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginationParams {
  page: number;
  page_size: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/* ===================== ERROR HANDLING ===================== */

export interface AppError {
  code: string;
  message: string;
  module?: string;
  details?: string;
  timestamp: ISODateTime;
}
