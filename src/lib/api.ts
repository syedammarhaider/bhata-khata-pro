import { invoke } from "@tauri-apps/api/core";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  brick_grade: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  order_date: string;
  delivery_date: string | null;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid_amount: number;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface GatePass {
  id: number;
  pass_number: string;
  order_id: number | null;
  customer_id: number;
  customer_name: string;
  dispatch_date: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  brick_grade: string;
  quantity: number;
  unit: string;
  destination: string;
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface Supplier {
  id: number;
  supplier_code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  credit_limit: number;
  status: string;
  created_at: string;
  updated_at: string;
  outstanding_balance: number;
}

export interface Payment {
  id: number;
  payment_number: string;
  payment_type: string;
  party_type: string;
  party_id: number;
  party_name: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference: string;
  notes: string;
  status: string;
  created_by: string;
  created_at: string;
}

export interface Wage {
  id: number;
  wage_number: string;
  worker_id: number;
  worker_name: string;
  period_start: string;
  period_end: string;
  total_days: number;
  daily_wage: number;
  total_amount: number;
  advances: number;
  deductions: number;
  net_amount: number;
  status: string;
  payment_date: string | null;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface Expense {
  id: number;
  expense_number: string;
  category: string;
  amount: number;
  expense_date: string;
  description: string;
  payment_method: string;
  status: string;
  created_by: string;
  created_at: string;
}

export interface PurchaseItem {
  id: number;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

export interface Purchase {
  id: number;
  purchase_number: string;
  supplier_id: number;
  supplier_name: string;
  purchase_date: string;
  subtotal: number;
  tax: number;
  total: number;
  paid_amount: number;
  payment_status: string;
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
  items: PurchaseItem[];
}

export interface CoalFuel {
  id: number;
  fuel_type: string;
  quantity: number;
  unit: string;
  purchase_date: string;
  supplier: string;
  cost: number;
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface Transport {
  id: number;
  trip_number: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  trip_date: string;
  route: string;
  bricks_transported: number;
  cost: number;
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface InvoiceItem {
  id: number;
  brick_grade: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  paid_amount: number;
  balance: number;
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
  items: InvoiceItem[];
}

export interface SaleReturn {
  id: number;
  sale_id: number;
  invoice_number: string;
  customer_name: string;
  brick_grade: string;
  quantity: number;
  reason: string;
  status: string;
  return_date: string;
  credit_amount: number;
  credit_applied: number;
  credit_remaining: number;
}

export interface CashbookEntry {
  id: number;
  entry_date: string;
  description: string;
  entry_type: string;
  amount: number;
  balance: number;
  reference_type: string;
  reference_id: number | null;
  created_by: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  username: string;
  action: string;
  module: string;
  record_id: number | null;
  old_values: string | null;
  new_values: string | null;
  ip_address: string;
  created_at: string;
}

export interface DashboardData {
  total_sales: number;
  total_orders: number;
  total_customers: number;
  total_inventory: number;
  total_workers: number;
  pending_orders: number;
  pending_payments: number;
  total_expenses: number;
  total_purchases: number;
  total_production: number;
  low_stock_count: number;
  recent_sales: any[];
  recent_orders: Order[];
  recent_payments: Payment[];
  recent_expenses: Expense[];
}

// ─── Orders ────────────────────────────────────────────────────────────────

export const getOrders = () => invoke<Order[]>("get_orders");
export const saveOrder = (order: Order) => invoke<Order>("save_order", { order });
export const deleteOrder = (id: number) => invoke<void>("delete_order", { orderId: id });
export const updateOrderStatus = (id: number, status: string) =>
  invoke<Order>("update_order_status", { orderId: id, status });

// ─── Gate Passes ───────────────────────────────────────────────────────────

export const getGatePasses = () => invoke<GatePass[]>("get_gate_passes");
export const saveGatePass = (pass: GatePass) => invoke<GatePass>("save_gate_pass", { pass });
export const deleteGatePass = (id: number) => invoke<void>("delete_gate_pass", { passId: id });
export const updateGatePassStatus = (id: number, status: string) =>
  invoke<GatePass>("update_gate_pass_status", { passId: id, status });

// ─── Suppliers ─────────────────────────────────────────────────────────────

export const getSuppliers = () => invoke<Supplier[]>("get_suppliers");
export const saveSupplier = (supplier: Supplier) => invoke<Supplier>("save_supplier", { supplier });
export const deleteSupplier = (id: number) => invoke<void>("delete_supplier", { supplierId: id });

// ─── Payments ──────────────────────────────────────────────────────────────

export const getPayments = () => invoke<Payment[]>("get_payments");
export const savePayment = (payment: Payment) => invoke<Payment>("save_payment", { payment });
export const deletePayment = (id: number) => invoke<void>("delete_payment", { paymentId: id });

// ─── Wages ─────────────────────────────────────────────────────────────────

export const getWages = () => invoke<Wage[]>("get_wages");
export const saveWage = (wage: Wage) => invoke<Wage>("save_wage", { wage });
export const updateWageStatus = (id: number, status: string, paymentDate?: string) =>
  invoke<Wage>("update_wage_status", { wageId: id, status, paymentDate: paymentDate ?? null });

// ─── Expenses ──────────────────────────────────────────────────────────────

export const getExpenses = () => invoke<Expense[]>("get_expenses");
export const saveExpense = (expense: Expense) => invoke<Expense>("save_expense", { expense });
export const deleteExpense = (id: number) => invoke<void>("delete_expense", { expenseId: id });

// ─── Purchases ─────────────────────────────────────────────────────────────

export const getPurchases = () => invoke<Purchase[]>("get_purchases");
export const savePurchase = (purchase: Purchase) => invoke<Purchase>("save_purchase", { purchase });

// ─── Coal & Fuel ───────────────────────────────────────────────────────────

export const getCoalFuel = () => invoke<CoalFuel[]>("get_coal_fuel");
export const saveCoalFuel = (fuel: CoalFuel) => invoke<CoalFuel>("save_coal_fuel", { fuel });
export const deleteCoalFuel = (id: number) => invoke<void>("delete_coal_fuel", { fuelId: id });

// ─── Transport ─────────────────────────────────────────────────────────────

export const getTransport = () => invoke<Transport[]>("get_transport");
export const saveTransport = (trip: Transport) => invoke<Transport>("save_transport", { trip });
export const deleteTransport = (id: number) => invoke<void>("delete_transport", { tripId: id });

// ─── Invoices ──────────────────────────────────────────────────────────────

export const getInvoices = () => invoke<Invoice[]>("get_invoices");
export const saveInvoice = (invoice: Invoice) => invoke<Invoice>("save_invoice", { invoice });

// ─── Cashbook ──────────────────────────────────────────────────────────────

export const getCashbook = () => invoke<CashbookEntry[]>("get_cashbook");

// ─── Audit Logs ────────────────────────────────────────────────────────────

export const getAuditLogs = (limit: number = 100) => invoke<AuditLog[]>("get_audit_logs", { limit });
export const createAuditLog = (
  userId: number,
  username: string,
  action: string,
  module: string,
  recordId?: number,
  oldValues?: string,
  newValues?: string
) => invoke<void>("create_audit_log", {
  userId, username, action, module,
  recordId: recordId ?? null,
  oldValues: oldValues ?? null,
  newValues: newValues ?? null,
});

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const getDashboardData = () => invoke<DashboardData>("get_dashboard_data");

// ─── Admin ─────────────────────────────────────────────────────────────────

export const ensureAdminUser = () => invoke<void>("ensure_admin_user");
export const changeAdminPassword = (oldPassword: string, newPassword: string) =>
  invoke<void>("change_admin_password", { oldPassword, newPassword });
export const getAdminSalesSummary = (days: number) =>
  invoke<any[]>("get_admin_sales_summary", { days });

// ─── Seed Data ─────────────────────────────────────────────────────────────

export const seedTestData = () => invoke<string>("seed_test_data");

// ─── Existing commands ─────────────────────────────────────────────────────

export const getSales = () => invoke<any[]>("get_sales");
export const getCustomers = () => invoke<any[]>("get_customers");
export const getInventory = () => invoke<any[]>("get_inventory");
export const getProductionBatches = () => invoke<any[]>("get_production_batches");
export const getWorkers = () => invoke<any[]>("get_workers");
export const getAttendance = () => invoke<any[]>("get_attendance");
export const getBrickGrades = () => invoke<any[]>("get_brick_grades");
export const getStockMovements = () => invoke<any[]>("get_stock_movements");
export const getSalePayments = () => invoke<any[]>("get_sale_payments");
export const getSaleReturns = () => invoke<any[]>("get_sale_returns");
export const getAppSettings = () => invoke<any[]>("get_app_settings");
export const getBusinessProfile = () => invoke<any>("get_business_profile");
export const getAppState = () => invoke<any>("get_app_state");
export const loginUser = (username: string, password: string) =>
  invoke<any>("login_user", { username, password });
export const setupAdminUser = (fullName: string, username: string, password: string) =>
  invoke<any>("setup_admin_user", { fullName, username, password });

// ─── Backup, Maintenance & Diagnostics ─────────────────────────────────────

export interface BackupInfo {
  name: string;
  path: string;
  size_bytes: number;
  created_at: string;
}

export interface SystemInfo {
  app_version: string;
  os: string;
  arch: string;
  db_path: string;
  db_size_bytes: number;
  wal_size_bytes: number;
  schema_version: number;
  generated_at: string;
}

export const createBackup = () => invoke<BackupInfo>("create_backup");
export const listBackups = () => invoke<BackupInfo[]>("list_backups");
export const restoreBackup = (backupName: string) =>
  invoke<string>("restore_backup", { backupName });
export const databaseMaintenance = () =>
  invoke<void>("database_maintenance");
export const getSystemInfo = () => invoke<SystemInfo>("get_system_info");
export const getRecentErrors = (maxLines = 200) =>
  invoke<string[]>("get_recent_errors", { maxLines });
export const logFrontendError = (message: string) =>
  invoke<void>("log_frontend_error", { message });
export const exportDiagnosticFile = () =>
  invoke<string>("export_diagnostic_file");
export const archiveOldRecords = (cutoffDate: string) =>
  invoke<string>("archive_old_records", { cutoffDate });
