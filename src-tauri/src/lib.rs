
use tauri::Manager;
use std::path::PathBuf;

mod database;
mod license_crypto;
mod licensing;

struct LicenseState {
    path: PathBuf,
}

#[tauri::command]
fn database_health(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::DatabaseHealth, String> {
    database::check_health(&state.path)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_business_profile(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Option<database::BusinessProfile>, String> {
    database::get_business_profile(&state.path)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn save_business_profile(
    profile: database::BusinessProfile,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    if profile.business_name.trim().is_empty() {
        return Err("Business name is required.".to_string());
    }

    if profile.owner_name.trim().is_empty() {
        return Err("Owner name is required.".to_string());
    }

    database::save_business_profile(&state.path, &profile)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_app_state(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::AppBootstrapState, String> {
    database::get_app_state(&state.path)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn setup_admin_user(
    full_name: String,
    username: String,
    password: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::AuthUser, String> {
    database::setup_admin_user(&state.path, &full_name, &username, &password)
}

#[tauri::command]
fn login_user(
    username: String,
    password: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::LoginResult, String> {
    database::login_user(&state.path, &username, &password)
}

#[tauri::command]
fn get_license_information(
    state: tauri::State<'_, LicenseState>,
) -> Result<licensing::LicenseInformation, String> {
    licensing::license_information(&state.path)
}

#[tauri::command]
fn activate_license(
    activation_key: String,
    state: tauri::State<'_, LicenseState>,
) -> Result<licensing::LicenseActivationResult, String> {
    licensing::activate_license(&state.path, &activation_key)
}

#[tauri::command]
fn check_license(
    state: tauri::State<'_, LicenseState>,
) -> Result<licensing::LicenseInformation, String> {
    licensing::license_information(&state.path)
}

#[tauri::command]
fn get_app_settings(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::AppSetting>, String> {
    database::get_app_settings(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_app_settings(
    settings: Vec<database::AppSetting>,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::save_app_settings(&state.path, &settings)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_brick_grades(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::BrickGrade>, String> {
    database::get_brick_grades(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_brick_grade(
    grade: database::BrickGrade,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::BrickGrade, String> {
    database::save_brick_grade(&state.path, grade)
}

#[tauri::command]
fn delete_brick_grade(
    grade_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_brick_grade(&state.path, grade_id)
}

#[tauri::command]
fn get_workers(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::Worker>, String> {
    database::get_workers(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_worker(
    worker: database::Worker,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::Worker, String> {
    database::save_worker(&state.path, worker)
}

#[tauri::command]
fn get_attendance(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::AttendanceRecord>, String> {
    database::get_attendance(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn upsert_attendance(
    record: database::AttendanceRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::AttendanceRecord, String> {
    database::upsert_attendance(&state.path, record)
}

#[tauri::command]
fn get_inventory(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::InventoryRecord>, String> {
    database::get_inventory(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn adjust_inventory(
    grade_name: String,
    quantity: i64,
    reorder_level: i64,
    reason: String,
    movement_type: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::InventoryRecord, String> {
    database::adjust_inventory(&state.path, &grade_name, quantity, reorder_level, &reason, &movement_type)
}

#[tauri::command]
fn get_stock_movements(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::StockMovementRecord>, String> {
    database::get_stock_movements(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn get_production_batches(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::ProductionBatchRecord>, String> {
    database::get_production_batches(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_production_batch(
    batch: database::ProductionBatchRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::ProductionBatchRecord, String> {
    database::save_production_batch(&state.path, batch)
}

#[tauri::command]
fn delete_production_batch(
    batch_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_production_batch(&state.path, batch_id)
}

#[tauri::command]
fn get_sales(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::SaleRecord>, String> {
    database::get_sales(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn get_customers(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::CustomerRecord>, String> {
    database::get_customers(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn create_sale(
    sale: database::SaleRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SaleRecord, String> {
    database::create_sale(&state.path, sale)
}

#[tauri::command]
fn update_sale(
    sale: database::SaleRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SaleRecord, String> {
    database::update_sale(&state.path, sale)
}

#[tauri::command]
fn record_sale_payment(
    payment: database::SalePaymentRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SaleRecord, String> {
    database::record_sale_payment(&state.path, payment)
}

#[tauri::command]
fn cancel_sale(
    sale_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SaleRecord, String> {
    database::cancel_sale(&state.path, sale_id)
}

#[tauri::command]
fn get_sale_payments(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::SalePaymentRecord>, String> {
    database::get_sale_payments(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn get_sale_returns(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::SaleReturnRecord>, String> {
    database::get_sale_returns(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn create_sale_return(
    sale_return: database::SaleReturnRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SaleReturnRecord, String> {
    database::create_sale_return(&state.path, sale_return)
}

// ─── Orders ────────────────────────────────────────────────────────────────

#[tauri::command]
fn get_orders(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::OrderRecord>, String> {
    database::get_orders(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_order(
    order: database::OrderRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::OrderRecord, String> {
    database::save_order(&state.path, order)
}

#[tauri::command]
fn delete_order(
    order_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_order(&state.path, order_id)
}

#[tauri::command]
fn update_order_status(
    order_id: i64,
    status: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::OrderRecord, String> {
    database::update_order_status(&state.path, order_id, &status)
}

// ─── Gate Passes ───────────────────────────────────────────────────────────

#[tauri::command]
fn get_gate_passes(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::GatePassRecord>, String> {
    database::get_gate_passes(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_gate_pass(
    pass: database::GatePassRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::GatePassRecord, String> {
    database::save_gate_pass(&state.path, pass)
}

#[tauri::command]
fn delete_gate_pass(
    pass_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_gate_pass(&state.path, pass_id)
}

#[tauri::command]
fn update_gate_pass_status(
    pass_id: i64,
    status: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::GatePassRecord, String> {
    database::update_gate_pass_status(&state.path, pass_id, &status)
}

// ─── Suppliers ─────────────────────────────────────────────────────────────

#[tauri::command]
fn get_suppliers(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::SupplierRecord>, String> {
    database::get_suppliers(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_supplier(
    supplier: database::SupplierRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SupplierRecord, String> {
    database::save_supplier(&state.path, supplier)
}

#[tauri::command]
fn delete_supplier(
    supplier_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_supplier(&state.path, supplier_id)
}

// ─── Payments ──────────────────────────────────────────────────────────────

#[tauri::command]
fn get_payments(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::PaymentRecord>, String> {
    database::get_payments(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_payment(
    payment: database::PaymentRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::PaymentRecord, String> {
    database::save_payment(&state.path, payment)
}

#[tauri::command]
fn delete_payment(
    payment_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_payment(&state.path, payment_id)
}

// ─── Wages ─────────────────────────────────────────────────────────────────

#[tauri::command]
fn get_wages(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::WageRecord>, String> {
    database::get_wages(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_wage(
    wage: database::WageRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::WageRecord, String> {
    database::save_wage(&state.path, wage)
}

#[tauri::command]
fn update_wage_status(
    wage_id: i64,
    status: String,
    payment_date: Option<String>,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::WageRecord, String> {
    database::update_wage_status(&state.path, wage_id, &status, payment_date)
}

// ─── Expenses ──────────────────────────────────────────────────────────────

#[tauri::command]
fn get_expenses(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::ExpenseRecord>, String> {
    database::get_expenses(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_expense(
    expense: database::ExpenseRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::ExpenseRecord, String> {
    database::save_expense(&state.path, expense)
}

#[tauri::command]
fn delete_expense(
    expense_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_expense(&state.path, expense_id)
}

// ─── Purchases ─────────────────────────────────────────────────────────────

#[tauri::command]
fn get_purchases(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::PurchaseRecord>, String> {
    database::get_purchases(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_purchase(
    purchase: database::PurchaseRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::PurchaseRecord, String> {
    database::save_purchase(&state.path, purchase)
}

// ─── Coal & Fuel ───────────────────────────────────────────────────────────

#[tauri::command]
fn get_coal_fuel(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::CoalFuelRecord>, String> {
    database::get_coal_fuel(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_coal_fuel(
    fuel: database::CoalFuelRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::CoalFuelRecord, String> {
    database::save_coal_fuel(&state.path, fuel)
}

#[tauri::command]
fn delete_coal_fuel(
    fuel_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_coal_fuel(&state.path, fuel_id)
}

// ─── Transport ─────────────────────────────────────────────────────────────

#[tauri::command]
fn get_transport(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::TransportRecord>, String> {
    database::get_transport(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_transport(
    trip: database::TransportRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::TransportRecord, String> {
    database::save_transport(&state.path, trip)
}

#[tauri::command]
fn delete_transport(
    trip_id: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::delete_transport(&state.path, trip_id)
}

// ─── Invoices ──────────────────────────────────────────────────────────────

#[tauri::command]
fn get_invoices(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::InvoiceRecord>, String> {
    database::get_invoices(&state.path).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_invoice(
    invoice: database::InvoiceRecord,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::InvoiceRecord, String> {
    database::save_invoice(&state.path, invoice)
}

// ─── Cashbook ──────────────────────────────────────────────────────────────

#[tauri::command]
fn get_cashbook(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::CashbookRecord>, String> {
    database::get_cashbook(&state.path).map_err(|error| error.to_string())
}

// ─── Audit Logs ────────────────────────────────────────────────────────────

#[tauri::command]
fn get_audit_logs(
    limit: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::AuditLogRecord>, String> {
    database::get_audit_logs(&state.path, limit).map_err(|error| error.to_string())
}

#[tauri::command]
fn create_audit_log(
    user_id: i64,
    username: String,
    action: String,
    module: String,
    record_id: Option<i64>,
    old_values: Option<String>,
    new_values: Option<String>,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::create_audit_log(&state.path, user_id, &username, &action, &module, record_id, old_values.as_deref(), new_values.as_deref())
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

#[tauri::command]
fn get_dashboard_data(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::DashboardData, String> {
    database::get_dashboard_data(&state.path).map_err(|error| error.to_string())
}

// ─── Admin ─────────────────────────────────────────────────────────────────

#[tauri::command]
fn ensure_admin_user(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::ensure_admin_user(&state.path)
}

#[tauri::command]
fn change_admin_password(
    old_password: String,
    new_password: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::change_admin_password(&state.path, &old_password, &new_password)
}

#[tauri::command]
fn change_user_password(
    user_id: i64,
    old_password: String,
    new_password: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::change_user_password(&state.path, user_id, &old_password, &new_password)
}

#[tauri::command]
fn get_admin_sales_summary(
    days: i64,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::SaleRecord>, String> {
    database::get_admin_sales_summary(&state.path, days)
}

// ─── Seed Data ─────────────────────────────────────────────────────────────

#[tauri::command]
fn seed_test_data(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<String, String> {
    database::seed_test_data(&state.path)
}

// ─── Backup, Maintenance & Diagnostics ─────────────────────────────────────

#[tauri::command]
fn create_backup(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::BackupInfo, String> {
    database::create_backup(&state.path)
}

#[tauri::command]
fn list_backups(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<database::BackupInfo>, String> {
    database::list_backups(&state.path)
}

#[tauri::command]
fn restore_backup(
    backup_name: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<String, String> {
    database::restore_backup(&state.path, &backup_name)
}

#[tauri::command]
fn database_maintenance(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::database_maintenance(&state.path)
}

#[tauri::command]
fn get_system_info(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<database::SystemInfo, String> {
    database::get_system_info(&state.path)
}

#[tauri::command]
fn get_recent_errors(
    max_lines: usize,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<Vec<String>, String> {
    database::get_recent_errors(&state.path, max_lines)
}

#[tauri::command]
fn log_frontend_error(
    message: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<(), String> {
    database::log_frontend_error(&state.path, &message)
}

#[tauri::command]
fn export_diagnostic_file(
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<String, String> {
    database::export_diagnostic_file(&state.path)
}

#[tauri::command]
fn archive_old_records(
    cutoff_date: String,
    state: tauri::State<'_, database::DatabaseState>,
) -> Result<String, String> {
    database::archive_old_records(&state.path, &cutoff_date)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;

            std::fs::create_dir_all(&app_data_dir)?;

            let database_path = app_data_dir.join("bhatta-khata-pro.db");

            database::initialize(&database_path)
                .map_err(std::io::Error::other)?;

            // Rotating panic log so fatal crashes leave a trace on kiln PCs.
            let panic_log = database::log_path_for_db(&database_path);
            std::panic::set_hook(Box::new(move |info| {
                database::append_log_line(&panic_log, &format!("PANIC: {}", info));
            }));

            // Startup maintenance: checkpoint WAL + refresh query planner stats.
            let _ = database::database_maintenance(&database_path);

            app.manage(database::DatabaseState {
                path: database_path,
            });

            app.manage(LicenseState {
                path: app_data_dir.join("license.json"),
            });

            println!("Bhatta Khata Pro database initialized.");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            database_health,
            get_business_profile,
            save_business_profile,
            get_app_state,
            setup_admin_user,
            login_user,
            get_license_information,
            activate_license,
            check_license,
            get_app_settings,
            save_app_settings,
            get_brick_grades,
            save_brick_grade,
            delete_brick_grade,
            get_workers,
            save_worker,
            get_attendance,
            upsert_attendance,
            get_inventory,
            adjust_inventory,
            get_stock_movements,
            get_production_batches,
            save_production_batch,
            delete_production_batch,
            get_sales,
            get_customers,
            create_sale,
            update_sale,
            record_sale_payment,
            get_sale_payments,
            get_sale_returns,
            create_sale_return,
            cancel_sale,
            get_orders,
            save_order,
            delete_order,
            update_order_status,
            get_gate_passes,
            save_gate_pass,
            delete_gate_pass,
            update_gate_pass_status,
            get_suppliers,
            save_supplier,
            delete_supplier,
            get_payments,
            save_payment,
            delete_payment,
            get_wages,
            save_wage,
            update_wage_status,
            get_expenses,
            save_expense,
            delete_expense,
            get_purchases,
            save_purchase,
            get_coal_fuel,
            save_coal_fuel,
            delete_coal_fuel,
            get_transport,
            save_transport,
            delete_transport,
            get_invoices,
            save_invoice,
            get_cashbook,
            get_audit_logs,
            create_audit_log,
            get_dashboard_data,
            ensure_admin_user,
            change_admin_password,
            change_user_password,
            get_admin_sales_summary,
            seed_test_data,
            create_backup,
            list_backups,
            restore_backup,
            database_maintenance,
            get_system_info,
            get_recent_errors,
            log_frontend_error,
            export_diagnostic_file,
            archive_old_records
        ])
        .build(tauri::generate_context!())
        .expect("error while building Bhatta Khata Pro")
        .run(|app_handle, event| {
            // On shutdown: WAL checkpoint (TRUNCATE) + planner stats so the
            // -wal file resets cleanly and the next start is fast.
            if let tauri::RunEvent::Exit = event {
                if let Some(state) = app_handle.try_state::<database::DatabaseState>() {
                    let _ = database::database_maintenance(&state.path);
                }
            }
        });
}
