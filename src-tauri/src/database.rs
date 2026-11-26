
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use rusqlite::{Connection, OptionalExtension, Result, Row};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

const SCHEMA_VERSION: i64 = 7;

pub struct DatabaseState {
    pub path: PathBuf,
}

#[derive(Serialize)]
pub struct DatabaseHealth {
    pub status: String,
    pub schema_version: i64,
    pub integrity_check: String,
}

#[derive(Serialize, Deserialize)]
pub struct BusinessProfile {
    pub business_name: String,
    pub owner_name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub city: String,
    pub country: String,
    pub currency: String,
    pub language: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AppSetting {
    pub setting_key: String,
    pub setting_value: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct BrickGrade {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub selling_price: f64,
    pub purchase_rate: f64,
    pub is_active: bool,
    pub is_default: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AttendanceRecord {
    pub id: i64,
    pub worker_id: i64,
    pub worker_name: String,
    pub attendance_date: String,
    pub status: String,
    pub check_in: Option<String>,
    pub check_out: Option<String>,
    pub break_minutes: i64,
    pub payable_hours: f64,
    pub notes: String,
    pub recorded_by: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct InventoryRecord {
    pub id: i64,
    pub grade_name: String,
    pub quantity: i64,
    pub reserved_quantity: i64,
    pub damaged_quantity: i64,
    pub reorder_level: i64,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StockMovementRecord {
    pub id: i64,
    pub grade_name: String,
    pub movement_type: String,
    pub quantity: i64,
    pub reference: String,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ProductionBatchRecord {
    pub id: i64,
    pub batch_number: String,
    pub brick_grade: String,
    pub planned_quantity: i64,
    pub produced_quantity: i64,
    pub damaged_quantity: i64,
    pub stage: String,
    pub status: String,
    pub start_date: String,
    pub expected_date: Option<String>,
    pub completed_date: Option<String>,
    pub notes: String,
    pub created_at: String,
    #[serde(default)]
    pub resources: Vec<ProductionResourceRecord>,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub struct ProductionResourceRecord {
    pub id: i64,
    pub resource_name: String,
    pub quantity: f64,
    pub unit: String,
    pub unit_cost: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SaleItemRecord {
    pub id: i64,
    pub brick_grade: String,
    pub quantity: i64,
    pub unit_price: f64,
    pub line_total: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SaleRecord {
    pub id: i64,
    pub invoice_number: String,
    pub customer_id: i64,
    pub customer_name: String,
    pub customer_phone: String,
    pub items: Vec<SaleItemRecord>,
    pub subtotal: f64,
    pub discount: f64,
    pub tax: f64,
    pub grand_total: f64,
    pub paid_amount: f64,
    pub due_amount: f64,
    pub status: String,
    pub payment_status: String,
    pub sale_date: String,
    pub notes: String,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SalePaymentRecord {
    pub id: i64,
    pub sale_id: i64,
    pub amount: f64,
    pub method: String,
    pub reference: String,
    pub payment_date: String,
    pub notes: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SaleReturnRecord {
    pub id: i64,
    pub sale_id: i64,
    pub invoice_number: String,
    pub customer_name: String,
    pub brick_grade: String,
    pub quantity: i64,
    pub reason: String,
    pub status: String,
    pub return_date: String,
    #[serde(default)]
    pub credit_amount: f64,
    #[serde(default)]
    pub credit_applied: f64,
    #[serde(default)]
    pub credit_remaining: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CustomerRecord {
    pub id: i64,
    pub customer_code: String,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub city: String,
    pub credit_limit: f64,
    pub outstanding_balance: f64,
    pub credit_balance: f64,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

fn open_connection(path: &Path) -> Result<Connection> {
    let connection = Connection::open(path)?;

    connection.execute_batch(
        "
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA cache_size = -64000;
        PRAGMA temp_store = MEMORY;
        ",
    )?;

    connection.busy_timeout(std::time::Duration::from_secs(5))?;

    Ok(connection)
}

pub fn initialize(path: &Path) -> Result<()> {
    let mut connection = open_connection(path)?;

    connection.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ",
    )?;

    let mut current_version: i64 = connection.query_row(
        "SELECT COALESCE(MAX(version), 0) FROM schema_migrations",
        [],
        |row| row.get(0),
    )?;

    if current_version < 1 {
        let transaction = connection.transaction()?;

        transaction.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS business_profile (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                business_name TEXT NOT NULL DEFAULT '',
                owner_name TEXT NOT NULL DEFAULT '',
                phone TEXT NOT NULL DEFAULT '',
                email TEXT NOT NULL DEFAULT '',
                address TEXT NOT NULL DEFAULT '',
                city TEXT NOT NULL DEFAULT '',
                country TEXT NOT NULL DEFAULT 'Pakistan',
                currency TEXT NOT NULL DEFAULT 'PKR',
                language TEXT NOT NULL DEFAULT 'en',
                logo_path TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS app_settings (
                setting_key TEXT PRIMARY KEY,
                setting_value TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
                is_active INTEGER NOT NULL DEFAULT 1
                    CHECK (is_active IN (0, 1)),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_username
                ON users(username);

            INSERT INTO schema_migrations (version)
            VALUES (1);
            ",
        )?;

        transaction.commit()?;
        current_version = 1;
    }

    if current_version < 2 {
        let transaction = connection.transaction()?;

        transaction.execute_batch(
            "
            ALTER TABLE users ADD COLUMN last_login_at TEXT;
            ALTER TABLE users ADD COLUMN failed_login_attempts
                INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE users ADD COLUMN locked_until TEXT;

            INSERT INTO schema_migrations (version)
            VALUES (2);
            ",
        )?;

        transaction.commit()?;
        current_version = 2;
    }

    if current_version < 3 {
        let transaction = connection.transaction()?;

        transaction.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS brick_grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL COLLATE NOCASE,
                description TEXT NOT NULL DEFAULT '',
                selling_price REAL NOT NULL DEFAULT 0
                    CHECK (selling_price >= 0),
                purchase_rate REAL NOT NULL DEFAULT 0
                    CHECK (purchase_rate >= 0),
                is_active INTEGER NOT NULL DEFAULT 1
                    CHECK (is_active IN (0, 1)),
                is_default INTEGER NOT NULL DEFAULT 0
                    CHECK (is_default IN (0, 1)),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(name)
            );

            CREATE TABLE IF NOT EXISTS brick_grade_price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                grade_id INTEGER NOT NULL,
                selling_price REAL NOT NULL CHECK (selling_price >= 0),
                purchase_rate REAL NOT NULL DEFAULT 0
                    CHECK (purchase_rate >= 0),
                effective_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                changed_by TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (grade_id) REFERENCES brick_grades(id)
            );

            CREATE TABLE IF NOT EXISTS workers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                phone TEXT NOT NULL DEFAULT '',
                labour_group TEXT NOT NULL DEFAULT '',
                work_category TEXT NOT NULL DEFAULT '',
                payment_method TEXT NOT NULL DEFAULT 'daily',
                wage_rate REAL NOT NULL DEFAULT 0 CHECK (wage_rate >= 0),
                status TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'inactive')),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id INTEGER NOT NULL,
                attendance_date TEXT NOT NULL,
                status TEXT NOT NULL CHECK (status IN
                    ('present','absent','half_day','late','early_departure','leave','weekly_off','holiday')),
                check_in TEXT,
                check_out TEXT,
                break_minutes INTEGER NOT NULL DEFAULT 0
                    CHECK (break_minutes >= 0),
                payable_hours REAL NOT NULL DEFAULT 0
                    CHECK (payable_hours >= 0),
                notes TEXT NOT NULL DEFAULT '',
                recorded_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worker_id) REFERENCES workers(id),
                UNIQUE(worker_id, attendance_date)
            );

            INSERT OR IGNORE INTO brick_grades
                (name, description, selling_price, is_default)
            VALUES ('A Grade', 'Standard A grade bricks', 0, 1),
                   ('B Grade', 'Standard B grade bricks', 0, 0);

            INSERT INTO schema_migrations (version)
            VALUES (3);
            ",
        )?;

        transaction.commit()?;
        current_version = 3;
    }

    if current_version < 4 {
        let transaction = connection.transaction()?;
        transaction.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                grade_name TEXT NOT NULL UNIQUE COLLATE NOCASE,
                quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
                reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
                damaged_quantity INTEGER NOT NULL DEFAULT 0 CHECK (damaged_quantity >= 0),
                reorder_level INTEGER NOT NULL DEFAULT 10000 CHECK (reorder_level >= 0),
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS stock_movements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                grade_name TEXT NOT NULL,
                movement_type TEXT NOT NULL CHECK (movement_type IN ('in','out','adjustment','damage','return')),
                quantity INTEGER NOT NULL CHECK (quantity >= 0),
                reference TEXT NOT NULL DEFAULT '',
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS production_batches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                batch_number TEXT NOT NULL UNIQUE,
                brick_grade TEXT NOT NULL,
                planned_quantity INTEGER NOT NULL CHECK (planned_quantity >= 0),
                produced_quantity INTEGER NOT NULL DEFAULT 0 CHECK (produced_quantity >= 0),
                damaged_quantity INTEGER NOT NULL DEFAULT 0 CHECK (damaged_quantity >= 0),
                stage TEXT NOT NULL CHECK (stage IN ('pathai','bhari','nikasi','completed')),
                status TEXT NOT NULL CHECK (status IN ('planned','in_progress','completed','cancelled')),
                start_date TEXT NOT NULL,
                expected_date TEXT,
                completed_date TEXT,
                notes TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number TEXT NOT NULL UNIQUE,
                customer_id INTEGER NOT NULL DEFAULT 0,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL DEFAULT '',
                subtotal REAL NOT NULL CHECK (subtotal >= 0),
                discount REAL NOT NULL DEFAULT 0 CHECK (discount >= 0),
                tax REAL NOT NULL DEFAULT 0 CHECK (tax >= 0),
                grand_total REAL NOT NULL CHECK (grand_total >= 0),
                paid_amount REAL NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
                due_amount REAL NOT NULL CHECK (due_amount >= 0),
                status TEXT NOT NULL CHECK (status IN ('draft','confirmed','completed','cancelled')),
                payment_status TEXT NOT NULL CHECK (payment_status IN ('unpaid','partial','paid')),
                sale_date TEXT NOT NULL,
                notes TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sale_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_id INTEGER NOT NULL,
                brick_grade TEXT NOT NULL,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                unit_price REAL NOT NULL CHECK (unit_price >= 0),
                line_total REAL NOT NULL CHECK (line_total >= 0),
                FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS sale_payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_id INTEGER NOT NULL,
                amount REAL NOT NULL CHECK (amount > 0),
                method TEXT NOT NULL,
                reference TEXT NOT NULL DEFAULT '',
                payment_date TEXT NOT NULL,
                notes TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS sales_returns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_id INTEGER NOT NULL,
                invoice_number TEXT NOT NULL,
                customer_name TEXT NOT NULL,
                brick_grade TEXT NOT NULL,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                reason TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'approved'
                    CHECK (status IN ('pending','approved','rejected')),
                return_date TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT
            );

            INSERT INTO schema_migrations (version) VALUES (4);
            ",
        )?;
        transaction.commit()?;
        current_version = 4;
    }

    if current_version < 5 {
        let transaction = connection.transaction()?;
        transaction.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS production_resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                batch_id INTEGER NOT NULL,
                resource_name TEXT NOT NULL,
                quantity REAL NOT NULL CHECK (quantity >= 0),
                unit TEXT NOT NULL DEFAULT '',
                unit_cost REAL NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
                FOREIGN KEY (batch_id) REFERENCES production_batches(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL COLLATE NOCASE,
                phone TEXT NOT NULL DEFAULT '',
                email TEXT NOT NULL DEFAULT '',
                address TEXT NOT NULL DEFAULT '',
                city TEXT NOT NULL DEFAULT '',
                credit_limit REAL NOT NULL DEFAULT 0 CHECK (credit_limit >= 0),
                status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_customers_name
                ON customers(name COLLATE NOCASE);

            INSERT INTO customers (customer_code,name,phone)
            SELECT 'CUST-' || printf('%05d', ROW_NUMBER() OVER (ORDER BY customer_key)),
                   customer_name,customer_phone
            FROM (
                SELECT
                    CASE WHEN trim(customer_phone) <> ''
                         THEN 'phone:' || trim(customer_phone)
                         ELSE 'name:' || lower(trim(customer_name)) END AS customer_key,
                    MIN(trim(customer_name)) AS customer_name,
                    CASE WHEN trim(customer_phone) <> ''
                         THEN trim(customer_phone) ELSE '' END AS customer_phone
                FROM sales
                WHERE customer_id <= 0 AND trim(customer_name) <> ''
                GROUP BY customer_key
            );

            UPDATE sales
            SET customer_id = (
                SELECT customers.id FROM customers
                WHERE (trim(sales.customer_phone) <> ''
                       AND customers.phone = trim(sales.customer_phone))
                   OR (trim(sales.customer_phone) = ''
                       AND customers.name = trim(sales.customer_name) COLLATE NOCASE
                       AND customers.phone = '')
                LIMIT 1
            )
            WHERE customer_id <= 0
              AND EXISTS (
                  SELECT 1 FROM customers
                  WHERE (trim(sales.customer_phone) <> ''
                         AND customers.phone = trim(sales.customer_phone))
                     OR (trim(sales.customer_phone) = ''
                         AND customers.name = trim(sales.customer_name) COLLATE NOCASE
                         AND customers.phone = '')
              );

            ALTER TABLE sales_returns
                ADD COLUMN credit_amount REAL NOT NULL DEFAULT 0
                CHECK (credit_amount >= 0);

            CREATE TABLE IF NOT EXISTS customer_credits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                sale_id INTEGER NOT NULL,
                return_id INTEGER NOT NULL UNIQUE,
                amount REAL NOT NULL CHECK (amount >= 0),
                applied_amount REAL NOT NULL DEFAULT 0 CHECK (applied_amount >= 0),
                remaining_amount REAL NOT NULL DEFAULT 0 CHECK (remaining_amount >= 0),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (sale_id) REFERENCES sales(id),
                FOREIGN KEY (return_id) REFERENCES sales_returns(id)
            );

            INSERT INTO schema_migrations (version) VALUES (5);
            ",
        )?;
        transaction.commit()?;
    }

    if current_version < 6 {
        let transaction = connection.transaction()?;
        transaction.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT NOT NULL UNIQUE,
                customer_id INTEGER NOT NULL,
                customer_name TEXT NOT NULL,
                order_date TEXT NOT NULL,
                delivery_date TEXT,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('draft','pending','confirmed','processing','completed','cancelled')),
                subtotal REAL NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
                discount REAL NOT NULL DEFAULT 0 CHECK (discount >= 0),
                tax REAL NOT NULL DEFAULT 0 CHECK (tax >= 0),
                total REAL NOT NULL DEFAULT 0 CHECK (total >= 0),
                paid_amount REAL NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id)
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                brick_grade TEXT NOT NULL,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                unit_price REAL NOT NULL CHECK (unit_price >= 0),
                discount REAL NOT NULL DEFAULT 0 CHECK (discount >= 0),
                total REAL NOT NULL CHECK (total >= 0),
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS gate_passes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pass_number TEXT NOT NULL UNIQUE,
                order_id INTEGER,
                customer_id INTEGER NOT NULL,
                customer_name TEXT NOT NULL,
                dispatch_date TEXT NOT NULL,
                vehicle_number TEXT NOT NULL DEFAULT '',
                driver_name TEXT NOT NULL DEFAULT '',
                driver_phone TEXT NOT NULL DEFAULT '',
                brick_grade TEXT NOT NULL,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                unit TEXT NOT NULL DEFAULT 'bricks',
                destination TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'prepared'
                    CHECK (status IN ('prepared','approved','dispatched','delivered','cancelled')),
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (order_id) REFERENCES orders(id)
            );

            CREATE TABLE IF NOT EXISTS suppliers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                supplier_code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL COLLATE NOCASE,
                phone TEXT NOT NULL DEFAULT '',
                email TEXT NOT NULL DEFAULT '',
                address TEXT NOT NULL DEFAULT '',
                city TEXT NOT NULL DEFAULT '',
                credit_limit REAL NOT NULL DEFAULT 0 CHECK (credit_limit >= 0),
                status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                payment_number TEXT NOT NULL UNIQUE,
                payment_type TEXT NOT NULL CHECK (payment_type IN ('receipt','payment')),
                party_type TEXT NOT NULL CHECK (party_type IN ('customer','supplier')),
                party_id INTEGER NOT NULL,
                party_name TEXT NOT NULL,
                payment_date TEXT NOT NULL,
                amount REAL NOT NULL CHECK (amount > 0),
                payment_method TEXT NOT NULL DEFAULT 'cash',
                reference TEXT NOT NULL DEFAULT '',
                notes TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','cancelled')),
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wage_number TEXT NOT NULL UNIQUE,
                worker_id INTEGER NOT NULL,
                worker_name TEXT NOT NULL,
                period_start TEXT NOT NULL,
                period_end TEXT NOT NULL,
                total_days INTEGER NOT NULL DEFAULT 0,
                daily_wage REAL NOT NULL DEFAULT 0 CHECK (daily_wage >= 0),
                total_amount REAL NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
                advances REAL NOT NULL DEFAULT 0 CHECK (advances >= 0),
                deductions REAL NOT NULL DEFAULT 0 CHECK (deductions >= 0),
                net_amount REAL NOT NULL DEFAULT 0 CHECK (net_amount >= 0),
                status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
                payment_date TEXT,
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worker_id) REFERENCES workers(id)
            );

            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                expense_number TEXT NOT NULL UNIQUE,
                category TEXT NOT NULL,
                amount REAL NOT NULL CHECK (amount > 0),
                expense_date TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                payment_method TEXT NOT NULL DEFAULT 'cash',
                status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS purchases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                purchase_number TEXT NOT NULL UNIQUE,
                supplier_id INTEGER NOT NULL,
                supplier_name TEXT NOT NULL,
                purchase_date TEXT NOT NULL,
                subtotal REAL NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
                tax REAL NOT NULL DEFAULT 0 CHECK (tax >= 0),
                total REAL NOT NULL DEFAULT 0 CHECK (total >= 0),
                paid_amount REAL NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
                payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','partial','paid')),
                status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft','completed','cancelled')),
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
            );

            CREATE TABLE IF NOT EXISTS purchase_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                purchase_id INTEGER NOT NULL,
                item_name TEXT NOT NULL,
                quantity REAL NOT NULL CHECK (quantity > 0),
                unit TEXT NOT NULL DEFAULT '',
                unit_price REAL NOT NULL CHECK (unit_price >= 0),
                total REAL NOT NULL CHECK (total >= 0),
                FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS coal_fuel (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fuel_type TEXT NOT NULL,
                quantity REAL NOT NULL CHECK (quantity > 0),
                unit TEXT NOT NULL DEFAULT '',
                purchase_date TEXT NOT NULL,
                supplier TEXT NOT NULL DEFAULT '',
                cost REAL NOT NULL DEFAULT 0 CHECK (cost >= 0),
                status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock','low_stock','out_of_stock')),
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transport (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_number TEXT NOT NULL UNIQUE,
                vehicle_number TEXT NOT NULL,
                driver_name TEXT NOT NULL,
                driver_phone TEXT NOT NULL DEFAULT '',
                trip_date TEXT NOT NULL,
                route TEXT NOT NULL DEFAULT '',
                bricks_transported INTEGER NOT NULL DEFAULT 0,
                cost REAL NOT NULL DEFAULT 0 CHECK (cost >= 0),
                status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number TEXT NOT NULL UNIQUE,
                customer_id INTEGER NOT NULL,
                customer_name TEXT NOT NULL,
                invoice_date TEXT NOT NULL,
                due_date TEXT NOT NULL,
                amount REAL NOT NULL CHECK (amount >= 0),
                paid_amount REAL NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
                balance REAL NOT NULL DEFAULT 0 CHECK (balance >= 0),
                status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid','partial','paid','overdue')),
                notes TEXT NOT NULL DEFAULT '',
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id)
            );

            CREATE TABLE IF NOT EXISTS invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                brick_grade TEXT NOT NULL,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                unit_price REAL NOT NULL CHECK (unit_price >= 0),
                total REAL NOT NULL CHECK (total >= 0),
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS cashbook (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry_date TEXT NOT NULL,
                description TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('income','expense')),
                amount REAL NOT NULL CHECK (amount > 0),
                balance REAL NOT NULL DEFAULT 0,
                reference_type TEXT NOT NULL DEFAULT '',
                reference_id INTEGER,
                created_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                action TEXT NOT NULL CHECK (action IN ('create','update','delete','view','login','logout')),
                module TEXT NOT NULL,
                record_id INTEGER,
                old_values TEXT,
                new_values TEXT,
                ip_address TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
            CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
            CREATE INDEX IF NOT EXISTS idx_gate_passes_customer ON gate_passes(customer_id);
            CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
            CREATE INDEX IF NOT EXISTS idx_wages_worker ON wages(worker_id);
            CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
            CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
            CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON audit_logs(module);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at);

            INSERT INTO schema_migrations (version) VALUES (6);
            ",
        )?;
        transaction.commit()?;
    }

    if current_version < 7 {
        let transaction = connection.transaction()?;
        transaction.execute_batch(
            "
            -- Query-planner indexes matching UI filter patterns.
            CREATE INDEX IF NOT EXISTS idx_sales_date_desc ON sales(sale_date DESC);
            CREATE INDEX IF NOT EXISTS idx_sales_customer_date ON sales(customer_id, sale_date DESC);
            CREATE INDEX IF NOT EXISTS idx_sales_status_date ON sales(status, sale_date DESC);
            CREATE INDEX IF NOT EXISTS idx_production_status_date ON production_batches(status, start_date DESC);
            CREATE INDEX IF NOT EXISTS idx_production_grade ON production_batches(brick_grade);
            CREATE INDEX IF NOT EXISTS idx_gatepass_date_status ON gate_passes(dispatch_date DESC, status);
            CREATE INDEX IF NOT EXISTS idx_gatepass_order ON gate_passes(order_id);
            CREATE INDEX IF NOT EXISTS idx_orders_date_status ON orders(order_date DESC, status);
            CREATE INDEX IF NOT EXISTS idx_attendance_worker_date ON attendance(worker_id, attendance_date DESC);
            CREATE INDEX IF NOT EXISTS idx_wages_period_worker ON wages(period_start, period_end, worker_id);
            CREATE INDEX IF NOT EXISTS idx_coal_fuel_date_type ON coal_fuel(purchase_date DESC, fuel_type);
            CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
            CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
            CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
            CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase ON purchase_items(purchase_id);
            CREATE INDEX IF NOT EXISTS idx_production_resources_batch ON production_resources(batch_id);
            CREATE INDEX IF NOT EXISTS idx_customer_credits_customer ON customer_credits(customer_id);
            CREATE INDEX IF NOT EXISTS idx_payments_party ON payments(party_type, party_id);

            INSERT INTO schema_migrations (version) VALUES (7);
            ",
        )?;
        transaction.commit()?;
    }

    // Data fix-up: grades seeded with zero selling price cannot be sold.
    // Assign sensible default rates so the sales form can auto-fill prices.
    connection.execute_batch(
        "
        UPDATE brick_grades SET
            selling_price = CASE
                WHEN UPPER(name) LIKE '%FIRST%' THEN 18.0
                WHEN UPPER(name) LIKE '%SECOND%' THEN 15.0
                WHEN UPPER(name) LIKE '%THIRD%' THEN 12.0
                WHEN UPPER(name) LIKE '%A %' OR UPPER(name) LIKE 'A%' THEN 18.0
                WHEN UPPER(name) LIKE '%B %' OR UPPER(name) LIKE 'B%' THEN 15.0
                WHEN UPPER(name) LIKE '%C %' OR UPPER(name) LIKE 'C%' THEN 12.0
                WHEN UPPER(name) LIKE '%D %' OR UPPER(name) LIKE 'D%' THEN 10.0
                WHEN UPPER(name) LIKE '%SECOND%' OR UPPER(name) LIKE '%SECONDS%' THEN 11.0
                ELSE 14.0
            END,
            purchase_rate = CASE
                WHEN UPPER(name) LIKE '%FIRST%' THEN 12.0
                WHEN UPPER(name) LIKE '%SECOND%' THEN 10.0
                WHEN UPPER(name) LIKE '%THIRD%' THEN 8.0
                ELSE 9.0
            END
        WHERE selling_price <= 0 OR purchase_rate <= 0;
        ",
    )?;

    Ok(())
}

pub fn check_health(path: &Path) -> Result<DatabaseHealth> {
    let connection = open_connection(path)?;

    let schema_version: i64 = connection.query_row(
        "SELECT COALESCE(MAX(version), 0) FROM schema_migrations",
        [],
        |row| row.get(0),
    )?;

    let integrity_check: String = connection.query_row(
        "PRAGMA integrity_check",
        [],
        |row| row.get(0),
    )?;

    let status = if integrity_check == "ok" && schema_version >= SCHEMA_VERSION {
        "healthy"
    } else {
        "attention_required"
    };

    Ok(DatabaseHealth {
        status: status.to_string(),
        schema_version,
        integrity_check,
    })
}

pub fn get_business_profile(
    path: &Path,
) -> Result<Option<BusinessProfile>> {
    let connection = open_connection(path)?;

    connection.query_row(
        "
        SELECT business_name, owner_name, phone, email,
               address, city, country, currency, language
        FROM business_profile
        WHERE id = 1
        ",
        [],
        |row| {
            Ok(BusinessProfile {
                business_name: row.get(0)?,
                owner_name: row.get(1)?,
                phone: row.get(2)?,
                email: row.get(3)?,
                address: row.get(4)?,
                city: row.get(5)?,
                country: row.get(6)?,
                currency: row.get(7)?,
                language: row.get(8)?,
            })
        },
    )
    .optional()
}

pub fn save_business_profile(
    path: &Path,
    profile: &BusinessProfile,
) -> Result<()> {
    let connection = open_connection(path)?;

    connection.execute(
        "
        INSERT INTO business_profile (
            id, business_name, owner_name, phone, email,
            address, city, country, currency, language
        )
        VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        ON CONFLICT(id) DO UPDATE SET
            business_name = excluded.business_name,
            owner_name = excluded.owner_name,
            phone = excluded.phone,
            email = excluded.email,
            address = excluded.address,
            city = excluded.city,
            country = excluded.country,
            currency = excluded.currency,
            language = excluded.language,
            updated_at = CURRENT_TIMESTAMP
        ",
        rusqlite::params![
            profile.business_name,
            profile.owner_name,
            profile.phone,
            profile.email,
            profile.address,
            profile.city,
            profile.country,
            profile.currency,
            profile.language
        ],
    )?;

    Ok(())
}

#[derive(Serialize)]
pub struct AppBootstrapState {
    pub business_profile: Option<BusinessProfile>,
    pub admin_exists: bool,
}

#[derive(Debug, Serialize)]
pub struct AuthUser {
    pub id: i64,
    pub full_name: String,
    pub username: String,
    pub role: String,
    pub is_active: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
pub struct AuthSessionInfo {
    pub user_id: i64,
    pub username: String,
    pub full_name: String,
    pub role: String,
    pub authenticated_at: String,
    pub expires_at: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResult {
    pub user: AuthUser,
    pub session: AuthSessionInfo,
}

fn auth_user_from_row(row: &Row<'_>) -> Result<AuthUser> {
    let is_active: i64 = row.get("is_active")?;

    Ok(AuthUser {
        id: row.get("id")?,
        full_name: row.get("full_name")?,
        username: row.get("username")?,
        role: row.get("role")?,
        is_active: is_active == 1,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

fn hash_password(password: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);

    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|error| format!("Unable to secure password: {error}"))
}

fn verify_password(password: &str, password_hash: &str) -> bool {
    let Ok(parsed_hash) = PasswordHash::new(password_hash) else {
        return false;
    };

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok()
}

pub fn admin_exists(path: &Path) -> Result<bool> {
    let connection = open_connection(path)?;

    connection.query_row(
        "SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1",
        [],
        |row| row.get::<_, i64>(0),
    )
    .map(|count| count > 0)
}

pub fn get_app_state(path: &Path) -> Result<AppBootstrapState> {
    Ok(AppBootstrapState {
        business_profile: get_business_profile(path)?,
        admin_exists: admin_exists(path)?,
    })
}

pub fn get_app_settings(path: &Path) -> Result<Vec<AppSetting>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT setting_key, setting_value
         FROM app_settings
         ORDER BY setting_key",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(AppSetting {
            setting_key: row.get(0)?,
            setting_value: row.get(1)?,
        })
    })?;

    rows.collect()
}

pub fn save_app_settings(
    path: &Path,
    settings: &[AppSetting],
) -> Result<()> {
    let mut connection = open_connection(path)?;
    let transaction = connection.transaction()?;

    for setting in settings {
        let key = setting.setting_key.trim();
        if key.is_empty() {
            continue;
        }

        transaction.execute(
            "INSERT INTO app_settings (setting_key, setting_value)
             VALUES (?1, ?2)
             ON CONFLICT(setting_key) DO UPDATE SET
                setting_value = excluded.setting_value,
                updated_at = CURRENT_TIMESTAMP",
            rusqlite::params![key, setting.setting_value],
        )?;
    }

    transaction.commit()?;
    Ok(())
}

pub fn get_brick_grades(path: &Path) -> Result<Vec<BrickGrade>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id, name, description, selling_price, purchase_rate,
                is_active, is_default
         FROM brick_grades
         ORDER BY is_default DESC, name COLLATE NOCASE",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(BrickGrade {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            selling_price: row.get(3)?,
            purchase_rate: row.get(4)?,
            is_active: row.get::<_, i64>(5)? == 1,
            is_default: row.get::<_, i64>(6)? == 1,
        })
    })?;

    rows.collect()
}

pub fn save_brick_grade(
    path: &Path,
    mut grade: BrickGrade,
) -> Result<BrickGrade, String> {
    grade.name = grade.name.trim().to_string();
    grade.description = grade.description.trim().to_string();

    if grade.name.is_empty() {
        return Err("Grade name is required.".to_string());
    }
    if grade.selling_price < 0.0 || grade.purchase_rate < 0.0 {
        return Err("Prices cannot be negative.".to_string());
    }

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    let price_changed = if grade.id > 0 {
        let previous: Option<(f64, f64)> = transaction.query_row(
            "SELECT selling_price,purchase_rate FROM brick_grades WHERE id=?1",
            [grade.id],
            |row| Ok((row.get(0)?,row.get(1)?)),
        ).optional().map_err(|error| error.to_string())?;
        previous.map(|(selling, purchase)| {
            selling != grade.selling_price || purchase != grade.purchase_rate
        }).unwrap_or(true)
    } else {
        true
    };

    if grade.is_default {
        transaction
            .execute("UPDATE brick_grades SET is_default = 0, updated_at = CURRENT_TIMESTAMP", [])
            .map_err(|error| error.to_string())?;
    }

    if grade.id > 0 {
        transaction
            .execute(
                "UPDATE brick_grades SET name = ?1, description = ?2,
                        selling_price = ?3, purchase_rate = ?4,
                        is_active = ?5, is_default = ?6,
                        updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?7",
                rusqlite::params![
                    grade.name,
                    grade.description,
                    grade.selling_price,
                    grade.purchase_rate,
                    grade.is_active as i64,
                    grade.is_default as i64,
                    grade.id
                ],
            )
            .map_err(|error| error.to_string())?;
    } else {
        transaction
            .execute(
                "INSERT INTO brick_grades
                    (name, description, selling_price, purchase_rate, is_active, is_default)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                rusqlite::params![
                    grade.name,
                    grade.description,
                    grade.selling_price,
                    grade.purchase_rate,
                    grade.is_active as i64,
                    grade.is_default as i64
                ],
            )
            .map_err(|error| error.to_string())?;
        grade.id = transaction.last_insert_rowid();
    }

    if price_changed {
        transaction.execute(
            "INSERT INTO brick_grade_price_history
                (grade_id, selling_price, purchase_rate)
             VALUES (?1, ?2, ?3)",
            rusqlite::params![grade.id, grade.selling_price, grade.purchase_rate],
        )
        .map_err(|error| error.to_string())?;
    }

    transaction.commit().map_err(|error| error.to_string())?;
    Ok(grade)
}

pub fn delete_brick_grade(path: &Path, grade_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let name: String = connection
        .query_row(
            "SELECT name FROM brick_grades WHERE id = ?1",
            [grade_id],
            |row| row.get(0),
        )
        .map_err(|_| "Brick grade not found.".to_string())?;

    let usage_count: i64 = connection.query_row(
        "SELECT
            (SELECT COUNT(*) FROM production_batches WHERE brick_grade=?1 COLLATE NOCASE) +
            (SELECT COUNT(*) FROM inventory WHERE grade_name=?1 COLLATE NOCASE) +
            (SELECT COUNT(*) FROM sale_items WHERE brick_grade=?1 COLLATE NOCASE)",
        [&name],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;

    if usage_count > 0 {
        return Err(
            "This grade is used by stock or transactions. Deactivate it instead."
                .to_string(),
        );
    }

    let mut connection = connection;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    transaction.execute("DELETE FROM brick_grade_price_history WHERE grade_id=?1", [grade_id])
        .map_err(|error| error.to_string())?;
    transaction.execute("DELETE FROM brick_grades WHERE id=?1", [grade_id])
        .map_err(|error| error.to_string())?;
    transaction.commit().map_err(|error| error.to_string())?;
    Ok(())
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Worker {
    pub id: i64,
    pub worker_code: String,
    pub name: String,
    pub phone: String,
    pub labour_group: String,
    pub work_category: String,
    pub payment_method: String,
    pub wage_rate: f64,
    pub status: String,
}

pub fn get_workers(path: &Path) -> Result<Vec<Worker>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id, worker_code, name, phone, labour_group, work_category,
                payment_method, wage_rate, status
         FROM workers
         ORDER BY name COLLATE NOCASE",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(Worker {
            id: row.get(0)?,
            worker_code: row.get(1)?,
            name: row.get(2)?,
            phone: row.get(3)?,
            labour_group: row.get(4)?,
            work_category: row.get(5)?,
            payment_method: row.get(6)?,
            wage_rate: row.get(7)?,
            status: row.get(8)?,
        })
    })?;

    rows.collect()
}

pub fn save_worker(path: &Path, mut worker: Worker) -> Result<Worker, String> {
    worker.worker_code = worker.worker_code.trim().to_string();
    worker.name = worker.name.trim().to_string();
    if worker.worker_code.is_empty() || worker.name.is_empty() {
        return Err("Worker code and name are required.".to_string());
    }
    if worker.wage_rate < 0.0 {
        return Err("Wage rate cannot be negative.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    if worker.id > 0 {
        connection
            .execute(
                "UPDATE workers SET worker_code = ?1, name = ?2, phone = ?3,
                        labour_group = ?4, work_category = ?5,
                        payment_method = ?6, wage_rate = ?7, status = ?8,
                        updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?9",
                rusqlite::params![
                    worker.worker_code,
                    worker.name,
                    worker.phone,
                    worker.labour_group,
                    worker.work_category,
                    worker.payment_method,
                    worker.wage_rate,
                    worker.status,
                    worker.id
                ],
            )
            .map_err(|error| error.to_string())?;
    } else {
        connection
            .execute(
                "INSERT INTO workers
                    (worker_code, name, phone, labour_group, work_category,
                     payment_method, wage_rate, status)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                rusqlite::params![
                    worker.worker_code,
                    worker.name,
                    worker.phone,
                    worker.labour_group,
                    worker.work_category,
                    worker.payment_method,
                    worker.wage_rate,
                    worker.status
                ],
            )
            .map_err(|error| error.to_string())?;
        worker.id = connection.last_insert_rowid();
    }

    Ok(worker)
}

pub fn get_attendance(path: &Path) -> Result<Vec<AttendanceRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT a.id, a.worker_id, w.name, a.attendance_date, a.status,
                a.check_in, a.check_out, a.break_minutes, a.payable_hours,
                a.notes, a.recorded_by
         FROM attendance a
         JOIN workers w ON w.id = a.worker_id
         ORDER BY a.attendance_date DESC, w.name COLLATE NOCASE",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(AttendanceRecord {
            id: row.get(0)?,
            worker_id: row.get(1)?,
            worker_name: row.get(2)?,
            attendance_date: row.get(3)?,
            status: row.get(4)?,
            check_in: row.get(5)?,
            check_out: row.get(6)?,
            break_minutes: row.get(7)?,
            payable_hours: row.get(8)?,
            notes: row.get(9)?,
            recorded_by: row.get(10)?,
        })
    })?;

    rows.collect()
}

pub fn upsert_attendance(
    path: &Path,
    mut record: AttendanceRecord,
) -> Result<AttendanceRecord, String> {
    record.attendance_date = record.attendance_date.trim().to_string();
    record.status = record.status.trim().to_lowercase();
    record.recorded_by = record.recorded_by.trim().to_string();

    let valid_statuses = [
        "present", "absent", "half_day", "late", "early_departure",
        "leave", "weekly_off", "holiday",
    ];
    if !valid_statuses.contains(&record.status.as_str()) {
        return Err("Invalid attendance status.".to_string());
    }
    if record.attendance_date.len() != 10 {
        return Err("Attendance date is invalid.".to_string());
    }
    if record.break_minutes < 0 || record.payable_hours < 0.0 {
        return Err("Attendance values cannot be negative.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    connection
        .execute(
            "INSERT INTO attendance
                (worker_id, attendance_date, status, check_in, check_out,
                 break_minutes, payable_hours, notes, recorded_by)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(worker_id, attendance_date) DO UPDATE SET
                status = excluded.status,
                check_in = excluded.check_in,
                check_out = excluded.check_out,
                break_minutes = excluded.break_minutes,
                payable_hours = excluded.payable_hours,
                notes = excluded.notes,
                recorded_by = excluded.recorded_by,
                updated_at = CURRENT_TIMESTAMP",
            rusqlite::params![
                record.worker_id,
                record.attendance_date,
                record.status,
                record.check_in,
                record.check_out,
                record.break_minutes,
                record.payable_hours,
                record.notes,
                record.recorded_by
            ],
        )
        .map_err(|error| error.to_string())?;

    record.id = connection
        .query_row(
            "SELECT id FROM attendance
             WHERE worker_id = ?1 AND attendance_date = ?2",
            rusqlite::params![record.worker_id, record.attendance_date],
            |row| row.get(0),
        )
        .map_err(|error| error.to_string())?;

    Ok(record)
}

pub fn get_inventory(path: &Path) -> Result<Vec<InventoryRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT COALESCE(i.id,g.id),g.name,COALESCE(i.quantity,0),
                COALESCE(i.reserved_quantity,0),COALESCE(i.damaged_quantity,0),
                COALESCE(i.reorder_level,10000),
                COALESCE(i.updated_at,CURRENT_TIMESTAMP)
         FROM brick_grades g
         LEFT JOIN inventory i ON i.grade_name=g.name COLLATE NOCASE
         WHERE g.is_active=1
         UNION ALL
         SELECT i.id,i.grade_name,i.quantity,i.reserved_quantity,i.damaged_quantity,
                i.reorder_level,i.updated_at
         FROM inventory i
         LEFT JOIN brick_grades g ON g.name=i.grade_name COLLATE NOCASE
         WHERE g.id IS NULL
         ORDER BY 2 COLLATE NOCASE",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(InventoryRecord {
            id: row.get(0)?,
            grade_name: row.get(1)?,
            quantity: row.get(2)?,
            reserved_quantity: row.get(3)?,
            damaged_quantity: row.get(4)?,
            reorder_level: row.get(5)?,
            updated_at: row.get(6)?,
        })
    })?;
    rows.collect()
}

fn connection_grade_is_active(path: &Path, grade_name: &str) -> Result<bool, String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    connection.query_row(
        "SELECT EXISTS(SELECT 1 FROM brick_grades
         WHERE name=?1 COLLATE NOCASE AND is_active=1)",
        [grade_name],
        |row| row.get::<_, i64>(0),
    )
    .map(|found| found == 1)
    .map_err(|error| error.to_string())
}

pub fn adjust_inventory(
    path: &Path,
    grade_name: &str,
    quantity: i64,
    reorder_level: i64,
    reason: &str,
    movement_type: &str,
) -> Result<InventoryRecord, String> {
    if grade_name.trim().is_empty() || reorder_level < 0 {
        return Err("A valid grade and reorder level are required.".to_string());
    }
    let active_grade: bool = connection_grade_is_active(path, grade_name.trim())?;
    if !active_grade {
        return Err("Select an active grade from Settings before adjusting stock.".to_string());
    }
    if !matches!(movement_type, "adjustment" | "damage" | "in" | "return") {
        return Err("Invalid stock movement type.".to_string());
    }
    if quantity < 0 {
        return Err("Stock quantity cannot be negative.".to_string());
    }

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    let existing: Option<(i64, i64)> = transaction.query_row(
        "SELECT quantity,reserved_quantity FROM inventory
         WHERE grade_name=?1 COLLATE NOCASE",
        [grade_name.trim()],
        |row| Ok((row.get(0)?,row.get(1)?)),
    ).optional().map_err(|error| error.to_string())?;
    if let Some((current_quantity, reserved_quantity)) = existing {
        if movement_type == "adjustment" && quantity < reserved_quantity {
            return Err("Stock quantity cannot be below the reserved quantity.".to_string());
        }
        if movement_type == "damage" && quantity > current_quantity {
            return Err("Damaged quantity cannot exceed current stock.".to_string());
        }
    } else if movement_type == "damage" {
        return Err("Cannot record damaged bricks for a grade with no stock.".to_string());
    }

    transaction
        .execute(
            "INSERT INTO inventory
                (grade_name, quantity, reserved_quantity, damaged_quantity, reorder_level)
             VALUES (?1, ?2, 0, 0, ?3)
             ON CONFLICT(grade_name) DO UPDATE SET
                reorder_level = excluded.reorder_level,
                quantity = CASE WHEN ?4 = 'adjustment' THEN ?2
                                WHEN ?4 = 'damage' THEN MAX(0, inventory.quantity - ?2)
                                WHEN ?4 = 'return' THEN inventory.quantity + ?2
                                ELSE inventory.quantity + ?2 END,
                damaged_quantity = CASE WHEN ?4 = 'damage'
                                        THEN inventory.damaged_quantity + ?2
                                        ELSE inventory.damaged_quantity END,
                updated_at = CURRENT_TIMESTAMP",
            rusqlite::params![grade_name.trim(), quantity, reorder_level, movement_type],
        )
        .map_err(|error| error.to_string())?;

    transaction
        .execute(
            "INSERT INTO stock_movements
                (grade_name, movement_type, quantity, reference, notes, created_by)
             VALUES (?1, ?2, ?3, 'MANUAL', ?4, 'admin')",
            rusqlite::params![grade_name.trim(), movement_type, quantity, reason.trim()],
        )
        .map_err(|error| error.to_string())?;

    let record = transaction
        .query_row(
            "SELECT id, grade_name, quantity, reserved_quantity, damaged_quantity,
                    reorder_level, updated_at
             FROM inventory WHERE grade_name = ?1 COLLATE NOCASE",
            [grade_name.trim()],
            |row| {
                Ok(InventoryRecord {
                    id: row.get(0)?,
                    grade_name: row.get(1)?,
                    quantity: row.get(2)?,
                    reserved_quantity: row.get(3)?,
                    damaged_quantity: row.get(4)?,
                    reorder_level: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            },
        )
        .map_err(|error| error.to_string())?;

    transaction.commit().map_err(|error| error.to_string())?;
    Ok(record)
}

pub fn get_stock_movements(path: &Path) -> Result<Vec<StockMovementRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id, grade_name, movement_type, quantity, reference, notes,
                created_by, created_at
         FROM stock_movements ORDER BY id DESC",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(StockMovementRecord {
            id: row.get(0)?,
            grade_name: row.get(1)?,
            movement_type: row.get(2)?,
            quantity: row.get(3)?,
            reference: row.get(4)?,
            notes: row.get(5)?,
            created_by: row.get(6)?,
            created_at: row.get(7)?,
        })
    })?;
    rows.collect()
}

pub fn get_production_batches(path: &Path) -> Result<Vec<ProductionBatchRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id, batch_number, brick_grade, planned_quantity,
                produced_quantity, damaged_quantity, stage, status,
                start_date, expected_date, completed_date, notes, created_at
         FROM production_batches ORDER BY id DESC",
    )?;
    let rows = statement.query_map([], |row| {
        Ok(ProductionBatchRecord {
            id: row.get(0)?,
            batch_number: row.get(1)?,
            brick_grade: row.get(2)?,
            planned_quantity: row.get(3)?,
            produced_quantity: row.get(4)?,
            damaged_quantity: row.get(5)?,
            stage: row.get(6)?,
            status: row.get(7)?,
            start_date: row.get(8)?,
            expected_date: row.get(9)?,
            completed_date: row.get(10)?,
            notes: row.get(11)?,
            created_at: row.get(12)?,
            resources: Vec::new(),
        })
    })?;
    let mut batches: Vec<ProductionBatchRecord> = rows.collect::<Result<Vec<_>>>()?;
    for batch in &mut batches {
        batch.resources = query_production_resources(&connection, batch.id)?;
    }
    Ok(batches)
}

fn query_production_resources(
    connection: &Connection,
    batch_id: i64,
) -> Result<Vec<ProductionResourceRecord>> {
    let mut statement = connection.prepare(
        "SELECT id,resource_name,quantity,unit,unit_cost
         FROM production_resources WHERE batch_id=?1 ORDER BY id",
    )?;
    let rows = statement.query_map([batch_id], |row| Ok(ProductionResourceRecord {
        id: row.get(0)?,
        resource_name: row.get(1)?,
        quantity: row.get(2)?,
        unit: row.get(3)?,
        unit_cost: row.get(4)?,
    }))?;
    rows.collect()
}

pub fn save_production_batch(
    path: &Path,
    mut batch: ProductionBatchRecord,
) -> Result<ProductionBatchRecord, String> {
    if batch.batch_number.trim().is_empty() || batch.brick_grade.trim().is_empty() {
        return Err("Batch number and brick grade are required.".to_string());
    }
    if batch.planned_quantity < 1 || batch.produced_quantity < 0 ||
        batch.produced_quantity > batch.planned_quantity ||
        batch.damaged_quantity < 0 || batch.damaged_quantity > batch.produced_quantity {
        return Err("Production quantities must be valid and non-negative.".to_string());
    }
    if batch.resources.iter().any(|resource| resource.resource_name.trim().is_empty()
        || !resource.quantity.is_finite() || resource.quantity < 0.0
        || !resource.unit_cost.is_finite() || resource.unit_cost < 0.0)
    {
        return Err("Resource name, quantity, or unit cost is invalid.".to_string());
    }

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;

    if batch.id == 0 {
        let is_active: i64 = transaction.query_row(
            "SELECT EXISTS(SELECT 1 FROM brick_grades
             WHERE name=?1 COLLATE NOCASE AND is_active=1)",
            [batch.brick_grade.trim()],
            |row| row.get(0),
        ).map_err(|error| error.to_string())?;
        if is_active != 1 {
            return Err("Production batch must use an active configured brick grade.".to_string());
        }
    }

    if batch.id > 0 {
        let (previous_status, previous_produced, previous_damaged, previous_grade):
            (String, i64, i64, String) = transaction.query_row(
            "SELECT status,produced_quantity,damaged_quantity,brick_grade
             FROM production_batches WHERE id=?1",
            [batch.id],
            |row| Ok((row.get(0)?,row.get(1)?,row.get(2)?,row.get(3)?)),
        ).map_err(|_| "Production batch not found.".to_string())?;
        if previous_status == "completed" &&
            (batch.status != "completed" ||
             batch.produced_quantity != previous_produced ||
             batch.damaged_quantity != previous_damaged ||
             batch.brick_grade != previous_grade)
        {
            return Err("Completed production cannot be changed without a stock reversal.".to_string());
        }
        if previous_status == "completed" {
            let existing_resources = query_production_resources(&transaction, batch.id)
                .map_err(|error| error.to_string())?;
            if existing_resources != batch.resources {
                return Err("Resources for completed production cannot be changed.".to_string());
            }
        }
        if previous_status != "completed" && batch.status == "completed" {
            let good_quantity = batch.produced_quantity.saturating_sub(batch.damaged_quantity);
            if good_quantity > 0 {
                transaction.execute(
                    "INSERT INTO inventory
                        (grade_name,quantity,reserved_quantity,damaged_quantity,reorder_level)
                     VALUES (?1,?2,0,?3,10000)
                     ON CONFLICT(grade_name) DO UPDATE SET
                        quantity=inventory.quantity+?2,
                        damaged_quantity=inventory.damaged_quantity+?3,
                        updated_at=CURRENT_TIMESTAMP",
                    rusqlite::params![batch.brick_grade,good_quantity,batch.damaged_quantity],
                ).map_err(|error| error.to_string())?;
                transaction.execute(
                    "INSERT INTO stock_movements
                        (grade_name,movement_type,quantity,reference,notes,created_by)
                     VALUES (?1,'in',?2,?3,'Production batch completion','admin')",
                    rusqlite::params![batch.brick_grade,good_quantity,batch.batch_number],
                ).map_err(|error| error.to_string())?;
            }
        }
        transaction
            .execute(
                "UPDATE production_batches SET batch_number=?1, brick_grade=?2,
                        planned_quantity=?3, produced_quantity=?4,
                        damaged_quantity=?5, stage=?6, status=?7,
                        start_date=?8, expected_date=?9, completed_date=?10,
                        notes=?11, updated_at=CURRENT_TIMESTAMP
                 WHERE id=?12",
                rusqlite::params![
                    batch.batch_number.trim(), batch.brick_grade.trim(),
                    batch.planned_quantity, batch.produced_quantity,
                    batch.damaged_quantity, batch.stage, batch.status,
                    batch.start_date, batch.expected_date, batch.completed_date,
                    batch.notes.trim(), batch.id
                ],
            )
            .map_err(|error| error.to_string())?;
    } else {
        transaction
            .execute(
                "INSERT INTO production_batches
                    (batch_number, brick_grade, planned_quantity, produced_quantity,
                     damaged_quantity, stage, status, start_date, expected_date,
                     completed_date, notes)
                 VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
                rusqlite::params![
                    batch.batch_number.trim(), batch.brick_grade.trim(),
                    batch.planned_quantity, batch.produced_quantity,
                    batch.damaged_quantity, batch.stage, batch.status,
                    batch.start_date, batch.expected_date, batch.completed_date,
                    batch.notes.trim()
                ],
            )
            .map_err(|error| error.to_string())?;
        batch.id = transaction.last_insert_rowid();
    }

    transaction.execute("DELETE FROM production_resources WHERE batch_id=?1", [batch.id])
        .map_err(|error| error.to_string())?;
    for resource in &batch.resources {
        transaction.execute(
            "INSERT INTO production_resources
                (batch_id,resource_name,quantity,unit,unit_cost)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![
                batch.id,resource.resource_name.trim(),resource.quantity,
                resource.unit.trim(),resource.unit_cost
            ],
        ).map_err(|error| error.to_string())?;
    }

    transaction.commit().map_err(|error| error.to_string())?;
    get_production_batch_by_id(path, batch.id)
}

fn get_production_batch_by_id(path: &Path, id: i64) -> Result<ProductionBatchRecord, String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let mut batch = connection.query_row(
        "SELECT id,batch_number,brick_grade,planned_quantity,produced_quantity,
                damaged_quantity,stage,status,start_date,expected_date,
                completed_date,notes,created_at
         FROM production_batches WHERE id=?1",
        [id],
        |row| Ok(ProductionBatchRecord {
            id: row.get(0)?, batch_number: row.get(1)?,
            brick_grade: row.get(2)?, planned_quantity: row.get(3)?,
            produced_quantity: row.get(4)?, damaged_quantity: row.get(5)?,
            stage: row.get(6)?, status: row.get(7)?,
            start_date: row.get(8)?, expected_date: row.get(9)?,
            completed_date: row.get(10)?, notes: row.get(11)?,
            created_at: row.get(12)?,
            resources: Vec::new(),
        }),
    ).map_err(|error| error.to_string())?;
    batch.resources = query_production_resources(&connection, id)
        .map_err(|error| error.to_string())?;
    Ok(batch)
}

pub fn delete_production_batch(path: &Path, id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let status: Option<String> = connection.query_row(
        "SELECT status FROM production_batches WHERE id=?1",
        [id],
        |row| row.get(0),
    ).optional().map_err(|error| error.to_string())?;
    let Some(status) = status else {
        return Err("Production batch not found.".to_string());
    };
    if status == "completed" {
        return Err("Completed production batches cannot be deleted because they have updated stock.".to_string());
    }
    let deleted = connection
        .execute("DELETE FROM production_batches WHERE id=?1", [id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Production batch not found.".to_string());
    }
    Ok(())
}

pub fn get_sales(path: &Path) -> Result<Vec<SaleRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare("SELECT id FROM sales ORDER BY id DESC")?;
    let rows = statement.query_map([], |row| row.get::<_, i64>(0))?;
    let mut sales = Vec::new();
    for row in rows {
        let id = row?;
        let sale = connection.query_row(
            "SELECT id,invoice_number,customer_id,customer_name,customer_phone,
                    subtotal,discount,tax,grand_total,paid_amount,due_amount,
                    status,payment_status,sale_date,notes,created_at
             FROM sales WHERE id=?1",
            [id],
            |sale_row| {
                let mut items_statement = connection.prepare(
                    "SELECT id,brick_grade,quantity,unit_price,line_total
                     FROM sale_items WHERE sale_id=?1",
                ).map_err(rusqlite::Error::from)?;
                let item_rows = items_statement.query_map([id], |item_row| {
                    Ok(SaleItemRecord {
                        id: item_row.get(0)?,
                        brick_grade: item_row.get(1)?,
                        quantity: item_row.get(2)?,
                        unit_price: item_row.get(3)?,
                        line_total: item_row.get(4)?,
                    })
                })?;
                let mut items = Vec::new();
                for item in item_rows { items.push(item?); }

                Ok(SaleRecord {
                    id: sale_row.get(0)?, invoice_number: sale_row.get(1)?,
                    customer_id: sale_row.get(2)?, customer_name: sale_row.get(3)?,
                    customer_phone: sale_row.get(4)?, items,
                    subtotal: sale_row.get(5)?, discount: sale_row.get(6)?,
                    tax: sale_row.get(7)?, grand_total: sale_row.get(8)?,
                    paid_amount: sale_row.get(9)?, due_amount: sale_row.get(10)?,
                    status: sale_row.get(11)?, payment_status: sale_row.get(12)?,
                    sale_date: sale_row.get(13)?, notes: sale_row.get(14)?,
                    created_at: sale_row.get(15)?,
                })
            },
        )?;
        sales.push(sale);
    }
    Ok(sales)
}

pub fn get_customers(path: &Path) -> Result<Vec<CustomerRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT c.id,c.customer_code,c.name,c.phone,c.email,c.address,c.city,
                c.credit_limit,c.status,
                COALESCE((SELECT SUM(s.due_amount) FROM sales s
                          WHERE s.customer_id=c.id AND s.status!='cancelled'),0),
                COALESCE((SELECT SUM(cc.remaining_amount) FROM customer_credits cc
                          WHERE cc.customer_id=c.id),0),
                c.created_at,c.updated_at
         FROM customers c ORDER BY c.name COLLATE NOCASE",
    )?;
    let rows = statement.query_map([], |row| Ok(CustomerRecord {
        id: row.get(0)?,
        customer_code: row.get(1)?,
        name: row.get(2)?,
        phone: row.get(3)?,
        email: row.get(4)?,
        address: row.get(5)?,
        city: row.get(6)?,
        credit_limit: row.get(7)?,
        status: row.get(8)?,
        outstanding_balance: row.get(9)?,
        credit_balance: row.get(10)?,
        created_at: row.get(11)?,
        updated_at: row.get(12)?,
    }))?;
    rows.collect()
}

fn resolve_customer_id(
    transaction: &rusqlite::Transaction<'_>,
    customer_id: i64,
    name: &str,
    phone: &str,
) -> Result<i64, String> {
    if customer_id > 0 {
        let exists: i64 = transaction.query_row(
            "SELECT EXISTS(SELECT 1 FROM customers WHERE id=?1 AND status='active')",
            [customer_id],
            |row| row.get(0),
        ).map_err(|error| error.to_string())?;
        if exists != 1 {
            return Err("The selected customer is not active.".to_string());
        }
        return Ok(customer_id);
    }

    let found: Option<i64> = if phone.trim().is_empty() {
        transaction.query_row(
            "SELECT id FROM customers WHERE name=?1 COLLATE NOCASE
             AND phone='' AND status='active'",
            [name.trim()],
            |row| row.get(0),
        ).optional().map_err(|error| error.to_string())?
    } else {
        transaction.query_row(
            "SELECT id FROM customers WHERE phone=?1 AND status='active'",
            [phone.trim()],
            |row| row.get(0),
        ).optional().map_err(|error| error.to_string())?
    };
    if let Some(id) = found {
        transaction.execute(
            "UPDATE customers SET name=?1,phone=?2,updated_at=CURRENT_TIMESTAMP WHERE id=?3",
            rusqlite::params![name.trim(),phone.trim(),id],
        ).map_err(|error| error.to_string())?;
        return Ok(id);
    }

    let next: i64 = transaction.query_row(
        "SELECT COALESCE(MAX(id),0)+1 FROM customers",
        [],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    transaction.execute(
        "INSERT INTO customers (customer_code,name,phone) VALUES (?1,?2,?3)",
        rusqlite::params![format!("CUST-{next:05}"),name.trim(),phone.trim()],
    ).map_err(|error| error.to_string())?;
    Ok(transaction.last_insert_rowid())
}

pub fn create_sale(path: &Path, sale: SaleRecord) -> Result<SaleRecord, String> {
    if sale.customer_name.trim().is_empty() || sale.items.is_empty() {
        return Err("A customer and at least one item are required.".to_string());
    }
    if !sale.discount.is_finite() || !sale.tax.is_finite() ||
        sale.discount < 0.0 || sale.tax < 0.0 {
        return Err("Discount and tax cannot be negative.".to_string());
    }
    if sale.sale_date.len() != 10 ||
        !sale.sale_date.chars().enumerate().all(|(i, ch)| {
            if i == 4 || i == 7 { ch == '-' } else { ch.is_ascii_digit() }
        })
    {
        return Err("Sale date must use YYYY-MM-DD format.".to_string());
    }

    if sale.items.iter().any(|item| item.quantity <= 0 ||
        !item.unit_price.is_finite() || item.unit_price <= 0.0 ||
        item.brick_grade.trim().is_empty())
    {
        return Err("Sale item quantity, grade and price must be valid.".to_string());
    }
    let subtotal: f64 = sale.items.iter().map(|item| item.quantity as f64 * item.unit_price).sum();
    if sale.discount > subtotal {
        return Err("Discount cannot exceed the sale subtotal.".to_string());
    }
    let grand_total = ((subtotal - sale.discount + sale.tax).max(0.0) * 100.0).round() / 100.0;
    if subtotal <= 0.0 {
        return Err("Sale subtotal must be greater than zero.".to_string());
    }
    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    let customer_id = resolve_customer_id(
        &transaction, sale.customer_id, &sale.customer_name, &sale.customer_phone,
    )?;
    let year = &sale.sale_date[..4];
    let sequence: i64 = transaction.query_row(
        "SELECT COALESCE(MAX(id),0)+1 FROM sales",
        [],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    let invoice = format!("INV-{year}-{sequence:05}");

    transaction.execute(
        "INSERT INTO sales
            (invoice_number,customer_id,customer_name,customer_phone,subtotal,
             discount,tax,grand_total,paid_amount,due_amount,status,
             payment_status,sale_date,notes)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,0,?8,'confirmed','unpaid',?9,?10)",
        rusqlite::params![
            invoice, customer_id, sale.customer_name.trim(),
            sale.customer_phone.trim(), subtotal, sale.discount,
            sale.tax, grand_total, sale.sale_date, sale.notes.trim()
        ],
    ).map_err(|error| error.to_string())?;
    let sale_id = transaction.last_insert_rowid();

    for item in &sale.items {
        let is_active: i64 = transaction.query_row(
            "SELECT EXISTS(SELECT 1 FROM brick_grades
             WHERE name=?1 COLLATE NOCASE AND is_active=1)",
            [item.brick_grade.as_str()],
            |row| row.get(0),
        ).map_err(|error| error.to_string())?;
        if is_active != 1 {
            return Err(format!("{} is not an active configured grade.", item.brick_grade));
        }
        let available: Option<i64> = transaction.query_row(
            "SELECT quantity-reserved_quantity FROM inventory
             WHERE grade_name=?1 COLLATE NOCASE",
            [item.brick_grade.as_str()],
            |row| row.get(0),
        ).optional().map_err(|error| error.to_string())?;
        if available.unwrap_or(0) < item.quantity {
            return Err(format!("Insufficient stock for {}.", item.brick_grade));
        }
        let line_total = item.quantity as f64 * item.unit_price;
        transaction.execute(
            "INSERT INTO sale_items
                (sale_id,brick_grade,quantity,unit_price,line_total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![sale_id,item.brick_grade,item.quantity,item.unit_price,line_total],
        ).map_err(|error| error.to_string())?;
        transaction.execute(
            "UPDATE inventory SET quantity=quantity-?1,updated_at=CURRENT_TIMESTAMP
             WHERE grade_name=?2 COLLATE NOCASE",
            rusqlite::params![item.quantity,item.brick_grade],
        ).map_err(|error| error.to_string())?;
        transaction.execute(
            "INSERT INTO stock_movements
                (grade_name,movement_type,quantity,reference,notes,created_by)
             VALUES (?1,'out',?2,?3,'Customer sale','admin')",
            rusqlite::params![item.brick_grade,item.quantity,invoice],
        ).map_err(|error| error.to_string())?;
    }

    transaction.commit().map_err(|error| error.to_string())?;
    get_sales(path).map_err(|error| error.to_string())?.into_iter().find(|item| item.id == sale_id)
        .ok_or_else(|| "Sale could not be reloaded.".to_string())
}

pub fn update_sale(path: &Path, sale: SaleRecord) -> Result<SaleRecord, String> {
    if sale.id <= 0 || sale.customer_name.trim().is_empty() || sale.items.is_empty() {
        return Err("A valid sale, customer and at least one item are required.".to_string());
    }
    if !sale.discount.is_finite() || !sale.tax.is_finite() ||
        sale.discount < 0.0 || sale.tax < 0.0 {
        return Err("Discount and tax must be valid non-negative amounts.".to_string());
    }
    if sale.sale_date.len() != 10 ||
        !sale.sale_date.chars().enumerate().all(|(i, ch)| {
            if i == 4 || i == 7 { ch == '-' } else { ch.is_ascii_digit() }
        }) {
        return Err("Sale date must use YYYY-MM-DD format.".to_string());
    }
    if sale.items.iter().any(|item| item.quantity <= 0 ||
        !item.unit_price.is_finite() || item.unit_price <= 0.0 ||
        item.brick_grade.trim().is_empty()) {
        return Err("Sale item quantity, grade and price must be valid.".to_string());
    }
    let subtotal: f64 = sale.items.iter().map(|item| item.quantity as f64 * item.unit_price).sum();
    if sale.discount > subtotal {
        return Err("Discount cannot exceed the sale subtotal.".to_string());
    }
    let grand_total = ((subtotal - sale.discount + sale.tax).max(0.0) * 100.0).round() / 100.0;

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    let (invoice, paid_amount, status): (String, f64, String) = transaction.query_row(
        "SELECT invoice_number,paid_amount,status FROM sales WHERE id=?1",
        [sale.id],
        |row| Ok((row.get(0)?,row.get(1)?,row.get(2)?)),
    ).map_err(|_| "Sale not found.".to_string())?;
    if paid_amount > 0.0 || status == "cancelled" {
        return Err("Paid or cancelled sales cannot be edited.".to_string());
    }
    let returns_count: i64 = transaction.query_row(
        "SELECT COUNT(*) FROM sales_returns WHERE sale_id=?1",
        [sale.id],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    if returns_count > 0 {
        return Err("A sale with returns cannot be edited.".to_string());
    }
    let customer_id = resolve_customer_id(
        &transaction, sale.customer_id, &sale.customer_name, &sale.customer_phone,
    )?;

    let mut statement = transaction.prepare(
        "SELECT brick_grade,quantity FROM sale_items WHERE sale_id=?1",
    ).map_err(|error| error.to_string())?;
    let previous_items: Vec<(String, i64)> = statement.query_map([sale.id], |row| {
        Ok((row.get(0)?,row.get(1)?))
    }).map_err(|error| error.to_string())?.collect::<Result<Vec<_>, _>>()
        .map_err(|error| error.to_string())?;
    drop(statement);

    for (grade, quantity) in previous_items {
        transaction.execute(
            "UPDATE inventory SET quantity=quantity+?1 WHERE grade_name=?2 COLLATE NOCASE",
            rusqlite::params![quantity,grade],
        ).map_err(|error| error.to_string())?;
        transaction.execute(
            "INSERT INTO stock_movements (grade_name,movement_type,quantity,reference,notes,created_by)
             VALUES (?1,'return',?2,?3,'Sale edit stock reversal','admin')",
            rusqlite::params![grade,quantity,invoice],
        ).map_err(|error| error.to_string())?;
    }
    transaction.execute("DELETE FROM sale_items WHERE sale_id=?1", [sale.id])
        .map_err(|error| error.to_string())?;

    for item in &sale.items {
        let is_active: i64 = transaction.query_row(
            "SELECT EXISTS(SELECT 1 FROM brick_grades
             WHERE name=?1 COLLATE NOCASE AND is_active=1)",
            [item.brick_grade.as_str()],
            |row| row.get(0),
        ).map_err(|error| error.to_string())?;
        if is_active != 1 {
            return Err(format!("{} is not an active configured grade.", item.brick_grade));
        }
        let available: Option<i64> = transaction.query_row(
            "SELECT quantity-reserved_quantity FROM inventory WHERE grade_name=?1 COLLATE NOCASE",
            [item.brick_grade.as_str()],
            |row| row.get(0),
        ).optional().map_err(|error| error.to_string())?;
        if available.unwrap_or(0) < item.quantity {
            return Err(format!("Insufficient stock for {}.", item.brick_grade));
        }
        let line_total = item.quantity as f64 * item.unit_price;
        transaction.execute(
            "INSERT INTO sale_items (sale_id,brick_grade,quantity,unit_price,line_total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![sale.id,item.brick_grade,item.quantity,item.unit_price,line_total],
        ).map_err(|error| error.to_string())?;
        transaction.execute(
            "UPDATE inventory SET quantity=quantity-?1,updated_at=CURRENT_TIMESTAMP
             WHERE grade_name=?2 COLLATE NOCASE",
            rusqlite::params![item.quantity,item.brick_grade],
        ).map_err(|error| error.to_string())?;
        transaction.execute(
            "INSERT INTO stock_movements (grade_name,movement_type,quantity,reference,notes,created_by)
             VALUES (?1,'out',?2,?3,'Sale edited','admin')",
            rusqlite::params![item.brick_grade,item.quantity,invoice],
        ).map_err(|error| error.to_string())?;
    }
    transaction.execute(
        "UPDATE sales SET customer_id=?1,customer_name=?2,customer_phone=?3,
                subtotal=?4,discount=?5,tax=?6,grand_total=?7,due_amount=?7,
                sale_date=?8,notes=?9,updated_at=CURRENT_TIMESTAMP
         WHERE id=?10",
        rusqlite::params![
            customer_id,sale.customer_name.trim(),sale.customer_phone.trim(),
            subtotal,sale.discount,sale.tax,grand_total,sale.sale_date,
            sale.notes.trim(),sale.id
        ],
    ).map_err(|error| error.to_string())?;
    transaction.commit().map_err(|error| error.to_string())?;
    get_sales(path).map_err(|error| error.to_string())?.into_iter().find(|item| item.id == sale.id)
        .ok_or_else(|| "Sale could not be reloaded.".to_string())
}

pub fn record_sale_payment(path: &Path, payment: SalePaymentRecord) -> Result<SaleRecord, String> {
    if payment.amount <= 0.0 {
        return Err("Payment amount must be positive.".to_string());
    }
    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    let (paid_amount, due_amount): (f64,f64) = transaction.query_row(
        "SELECT paid_amount,due_amount FROM sales WHERE id=?1",
        [payment.sale_id],
        |row| Ok((row.get(0)?,row.get(1)?)),
    ).map_err(|_| "Sale not found.".to_string())?;
    if payment.amount > due_amount {
        return Err("Payment cannot exceed the outstanding balance.".to_string());
    }
    let new_paid = paid_amount + payment.amount;
    let new_due = (due_amount - payment.amount).max(0.0);
    let payment_status = if new_due <= 0.0 { "paid" } else { "partial" };
    let status = if new_due <= 0.0 { "completed" } else { "confirmed" };
    transaction.execute(
        "INSERT INTO sale_payments
            (sale_id,amount,method,reference,payment_date,notes)
         VALUES (?1,?2,?3,?4,?5,?6)",
        rusqlite::params![payment.sale_id,payment.amount,payment.method,payment.reference,payment.payment_date,payment.notes],
    ).map_err(|error| error.to_string())?;
    transaction.execute(
        "UPDATE sales SET paid_amount=?1,due_amount=?2,payment_status=?3,status=?4,
                         updated_at=CURRENT_TIMESTAMP WHERE id=?5",
        rusqlite::params![new_paid,new_due,payment_status,status,payment.sale_id],
    ).map_err(|error| error.to_string())?;
    transaction.commit().map_err(|error| error.to_string())?;
    get_sales(path).map_err(|error| error.to_string())?.into_iter().find(|item| item.id == payment.sale_id)
        .ok_or_else(|| "Sale could not be reloaded.".to_string())
}

pub fn cancel_sale(path: &Path, sale_id: i64) -> Result<SaleRecord, String> {
    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;
    let (status, invoice): (String, String) = transaction.query_row(
        "SELECT status,invoice_number FROM sales WHERE id=?1",
        [sale_id],
        |row| Ok((row.get(0)?, row.get(1)?)),
    ).map_err(|_| "Sale not found.".to_string())?;
    if status == "cancelled" {
        return Err("Sale is already cancelled.".to_string());
    }
    let paid: f64 = transaction.query_row(
        "SELECT paid_amount FROM sales WHERE id=?1",
        [sale_id],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    if paid > 0.0 {
        return Err("A sale with payments cannot be cancelled directly. Process a reversal first.".to_string());
    }

    let mut item_statement = transaction.prepare(
        "SELECT brick_grade,quantity FROM sale_items WHERE sale_id=?1",
    ).map_err(|error| error.to_string())?;
    let items: Vec<(String, i64)> = item_statement.query_map([sale_id], |row| {
        Ok((row.get(0)?, row.get(1)?))
    }).map_err(|error| error.to_string())?.collect::<Result<Vec<_>, _>>()
        .map_err(|error| error.to_string())?;
    drop(item_statement);

    for (grade, quantity) in items {
        transaction.execute(
            "UPDATE inventory SET quantity=quantity+?1,updated_at=CURRENT_TIMESTAMP
             WHERE grade_name=?2 COLLATE NOCASE",
            rusqlite::params![quantity, grade],
        ).map_err(|error| error.to_string())?;
        transaction.execute(
            "INSERT INTO stock_movements
                (grade_name,movement_type,quantity,reference,notes,created_by)
             VALUES (?1,'return',?2,?3,'Sale cancelled','admin')",
            rusqlite::params![grade, quantity, invoice],
        ).map_err(|error| error.to_string())?;
    }
    transaction.execute(
        "UPDATE sales SET status='cancelled',due_amount=0,payment_status='paid',
                         updated_at=CURRENT_TIMESTAMP WHERE id=?1",
        [sale_id],
    ).map_err(|error| error.to_string())?;
    transaction.commit().map_err(|error| error.to_string())?;
    get_sales(path).map_err(|error| error.to_string())?.into_iter().find(|item| item.id == sale_id)
        .ok_or_else(|| "Sale could not be reloaded.".to_string())
}

pub fn get_sale_payments(path: &Path) -> Result<Vec<SalePaymentRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,sale_id,amount,method,reference,payment_date,notes
         FROM sale_payments ORDER BY id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(SalePaymentRecord {
        id: row.get(0)?, sale_id: row.get(1)?, amount: row.get(2)?,
        method: row.get(3)?, reference: row.get(4)?,
        payment_date: row.get(5)?, notes: row.get(6)?,
    }))?;
    rows.collect()
}

pub fn get_sale_returns(path: &Path) -> Result<Vec<SaleReturnRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT r.id,r.sale_id,r.invoice_number,r.customer_name,r.brick_grade,
                r.quantity,r.reason,r.status,r.return_date,r.credit_amount,
                COALESCE(cc.applied_amount,0),COALESCE(cc.remaining_amount,0)
         FROM sales_returns r
         LEFT JOIN customer_credits cc ON cc.return_id=r.id
         ORDER BY r.id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(SaleReturnRecord {
        id: row.get(0)?, sale_id: row.get(1)?, invoice_number: row.get(2)?,
        customer_name: row.get(3)?, brick_grade: row.get(4)?,
        quantity: row.get(5)?, reason: row.get(6)?,
        status: row.get(7)?, return_date: row.get(8)?,
        credit_amount: row.get(9)?, credit_applied: row.get(10)?,
        credit_remaining: row.get(11)?,
    }))?;
    rows.collect()
}

pub fn create_sale_return(path: &Path, sale_return: SaleReturnRecord) -> Result<SaleReturnRecord, String> {
    if sale_return.quantity < 1 || sale_return.reason.trim().is_empty() {
        return Err("Return quantity and reason are required.".to_string());
    }
    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;

    let (invoice, customer, sale_status, customer_id, due_amount, subtotal, grand_total, paid_amount):
        (String, String, String, i64, f64, f64, f64, f64) = transaction.query_row(
        "SELECT invoice_number,customer_name,status,customer_id,due_amount,subtotal,grand_total,paid_amount
         FROM sales WHERE id=?1",
        [sale_return.sale_id],
        |row| Ok((row.get(0)?,row.get(1)?,row.get(2)?,row.get(3)?,
                  row.get(4)?,row.get(5)?,row.get(6)?,row.get(7)?)),
    ).map_err(|_| "Sale not found.".to_string())?;
    if sale_status == "cancelled" {
        return Err("Cannot return items from a cancelled sale.".to_string());
    }
    let sold: i64 = transaction.query_row(
        "SELECT COALESCE(SUM(quantity),0) FROM sale_items
         WHERE sale_id=?1 AND brick_grade=?2 COLLATE NOCASE",
        rusqlite::params![sale_return.sale_id, sale_return.brick_grade],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    let already_returned: i64 = transaction.query_row(
        "SELECT COALESCE(SUM(quantity),0) FROM sales_returns
         WHERE sale_id=?1 AND brick_grade=?2 COLLATE NOCASE
           AND status!='rejected'",
        rusqlite::params![sale_return.sale_id, sale_return.brick_grade],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    if sale_return.quantity + already_returned > sold {
        return Err("Return quantity exceeds the remaining sold quantity.".to_string());
    }
    if customer_id <= 0 {
        return Err("Sale is missing a customer account; cannot issue a credit.".to_string());
    }

    let grade_subtotal: f64 = transaction.query_row(
        "SELECT COALESCE(SUM(line_total),0) FROM sale_items
         WHERE sale_id=?1 AND brick_grade=?2 COLLATE NOCASE",
        rusqlite::params![sale_return.sale_id, sale_return.brick_grade],
        |row| row.get(0),
    ).map_err(|error| error.to_string())?;
    let unit_net_price = if sold > 0 && subtotal > 0.0 {
        (grade_subtotal / sold as f64) * (grand_total / subtotal)
    } else {
        0.0
    };
    let credit_amount =
        ((unit_net_price * sale_return.quantity as f64) * 100.0).round() / 100.0;
    let applied_amount = credit_amount.min(due_amount);
    let remaining_amount = (credit_amount - applied_amount).max(0.0);
    let new_due = (due_amount - applied_amount).max(0.0);
    let new_payment_status = if new_due <= 0.0 {
        "paid"
    } else if paid_amount > 0.0 || applied_amount > 0.0 {
        "partial"
    } else {
        "unpaid"
    };
    let new_sale_status = if new_due <= 0.0 { "completed" } else { &sale_status };

    transaction.execute(
        "INSERT INTO sales_returns
            (sale_id,invoice_number,customer_name,brick_grade,quantity,reason,status,return_date,credit_amount)
         VALUES (?1,?2,?3,?4,?5,?6,'approved',?7,?8)",
        rusqlite::params![
            sale_return.sale_id, invoice, customer, sale_return.brick_grade,
            sale_return.quantity, sale_return.reason.trim(), sale_return.return_date,
            credit_amount
        ],
    ).map_err(|error| error.to_string())?;
    let return_id = transaction.last_insert_rowid();
    transaction.execute(
        "INSERT INTO customer_credits
            (customer_id,sale_id,return_id,amount,applied_amount,remaining_amount)
         VALUES (?1,?2,?3,?4,?5,?6)",
        rusqlite::params![
            customer_id,sale_return.sale_id,return_id,credit_amount,
            applied_amount,remaining_amount
        ],
    ).map_err(|error| error.to_string())?;
    transaction.execute(
        "UPDATE sales SET due_amount=?1,payment_status=?2,status=?3,
                         updated_at=CURRENT_TIMESTAMP WHERE id=?4",
        rusqlite::params![new_due,new_payment_status,new_sale_status,sale_return.sale_id],
    ).map_err(|error| error.to_string())?;
    transaction.execute(
        "UPDATE inventory SET quantity=quantity+?1,updated_at=CURRENT_TIMESTAMP
         WHERE grade_name=?2 COLLATE NOCASE",
        rusqlite::params![sale_return.quantity,sale_return.brick_grade],
    ).map_err(|error| error.to_string())?;
    transaction.execute(
        "INSERT INTO stock_movements
            (grade_name,movement_type,quantity,reference,notes,created_by)
         VALUES (?1,'return',?2,?3,'Approved sales return','admin')",
        rusqlite::params![sale_return.brick_grade,sale_return.quantity,invoice],
    ).map_err(|error| error.to_string())?;
    transaction.commit().map_err(|error| error.to_string())?;
    get_sale_returns(path).map_err(|error| error.to_string())?.into_iter().find(|item| item.id == return_id)
        .ok_or_else(|| "Return could not be reloaded.".to_string())
}

pub fn setup_admin_user(
    path: &Path,
    full_name: &str,
    username: &str,
    password: &str,
) -> Result<AuthUser, String> {
    let full_name = full_name.trim();
    let username = username.trim();

    if full_name.is_empty() {
        return Err("Administrator name is required.".to_string());
    }

    if username.len() < 3 || username.len() > 50 {
        return Err("Username must be between 3 and 50 characters.".to_string());
    }

    if password.len() < 10 {
        return Err("Password must be at least 10 characters.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;

    let admin_count: i64 = connection
        .query_row(
            "SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1",
            [],
            |row| row.get(0),
        )
        .map_err(|error| error.to_string())?;

    if admin_count > 0 {
        return Err("Administrator account already exists.".to_string());
    }

    let password_hash = hash_password(password)?;

    connection
        .execute(
            "
            INSERT INTO users (
                full_name, username, password_hash, role, is_active
            )
            VALUES (?1, ?2, ?3, 'admin', 1)
            ",
            rusqlite::params![full_name, username, password_hash],
        )
        .map_err(|error| error.to_string())?;

    connection
        .query_row(
            "
            SELECT id, full_name, username, role, is_active,
                   created_at, updated_at
            FROM users
            WHERE username = ?1 COLLATE NOCASE
            ",
            [username],
            auth_user_from_row,
        )
        .map_err(|error| error.to_string())
}

pub fn login_user(
    path: &Path,
    username: &str,
    password: &str,
) -> Result<LoginResult, String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let username = username.trim();

    let user = connection
        .query_row(
            "
            SELECT id, full_name, username, password_hash, role,
                   is_active, failed_login_attempts, locked_until,
                   created_at, updated_at
            FROM users
            WHERE username = ?1 COLLATE NOCASE
            ",
            [username],
            |row| {
                Ok((
                    auth_user_from_row(row)?,
                    row.get::<_, String>("password_hash")?,
                    row.get::<_, i64>("failed_login_attempts")?,
                    row.get::<_, Option<String>>("locked_until")?,
                ))
            },
        )
        .optional()
        .map_err(|error| error.to_string())?;

    let Some((user, password_hash, failed_attempts, locked_until)) = user else {
        return Err("Invalid username or password.".to_string());
    };

    if !user.is_active {
        return Err("This account is inactive.".to_string());
    }

    if let Some(locked_until) = locked_until {
        let now: String = connection
            .query_row("SELECT datetime('now')", [], |row| row.get(0))
            .map_err(|error| error.to_string())?;

        if locked_until > now {
            return Err(
                "Too many failed attempts. Try again after the lockout period."
                    .to_string(),
            );
        }
    }

    if !verify_password(password, &password_hash) {
        let attempts = failed_attempts + 1;
        let lock_account = attempts >= 5;

        connection
            .execute(
                "
                UPDATE users
                SET failed_login_attempts = ?1,
                    locked_until = CASE
                        WHEN ?2 = 1 THEN datetime('now', '+15 minutes')
                        ELSE NULL
                    END,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?3
                ",
                rusqlite::params![attempts, lock_account as i64, user.id],
            )
            .map_err(|error| error.to_string())?;

        if lock_account {
            return Err(
                "Too many failed attempts. Try again after the lockout period."
                    .to_string(),
            );
        }

        return Err("Invalid username or password.".to_string());
    }

    let (authenticated_at, expires_at): (String, String) = connection
        .query_row(
            "SELECT datetime('now'), datetime('now', '+12 hours')",
            [],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .map_err(|error| error.to_string())?;

    connection
        .execute(
            "
            UPDATE users
            SET last_login_at = ?1,
                failed_login_attempts = 0,
                locked_until = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?2
            ",
            rusqlite::params![authenticated_at, user.id],
        )
        .map_err(|error| error.to_string())?;

    Ok(LoginResult {
        session: AuthSessionInfo {
            user_id: user.id,
            username: user.username.clone(),
            full_name: user.full_name.clone(),
            role: user.role.clone(),
            authenticated_at,
            expires_at,
        },
        user,
    })
}

// ─── Orders ────────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct OrderItemRecord {
    pub id: i64,
    pub brick_grade: String,
    pub quantity: i64,
    pub unit_price: f64,
    pub total: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct OrderRecord {
    pub id: i64,
    pub order_number: String,
    pub customer_id: i64,
    pub customer_name: String,
    pub order_date: String,
    pub delivery_date: Option<String>,
    pub status: String,
    pub subtotal: f64,
    pub discount: f64,
    pub tax: f64,
    pub total: f64,
    pub paid_amount: f64,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
    pub updated_at: String,
    pub items: Vec<OrderItemRecord>,
}

pub fn get_orders(path: &Path) -> Result<Vec<OrderRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id FROM orders ORDER BY order_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| row.get::<_, i64>(0))?;
    let mut orders = Vec::new();
    for row in rows {
        let id = row?;
        let order = connection.query_row(
            "SELECT id,order_number,customer_id,customer_name,order_date,
                    delivery_date,status,subtotal,discount,tax,total,
                    paid_amount,notes,created_by,created_at,updated_at
             FROM orders WHERE id=?1",
            [id],
            |r| {
                let mut items_stmt = connection.prepare(
                    "SELECT id,brick_grade,quantity,unit_price,total
                     FROM order_items WHERE order_id=?1",
                ).map_err(rusqlite::Error::from)?;
                let item_rows = items_stmt.query_map([id], |ir| {
                    Ok(OrderItemRecord {
                        id: ir.get(0)?,
                        brick_grade: ir.get(1)?,
                        quantity: ir.get(2)?,
                        unit_price: ir.get(3)?,
                        total: ir.get(4)?,
                    })
                })?;
                let mut items = Vec::new();
                for item in item_rows { items.push(item?); }
                Ok(OrderRecord {
                    id: r.get(0)?, order_number: r.get(1)?,
                    customer_id: r.get(2)?, customer_name: r.get(3)?,
                    order_date: r.get(4)?, delivery_date: r.get(5)?,
                    status: r.get(6)?, subtotal: r.get(7)?,
                    discount: r.get(8)?, tax: r.get(9)?,
                    total: r.get(10)?, paid_amount: r.get(11)?,
                    notes: r.get(12)?, created_by: r.get(13)?,
                    created_at: r.get(14)?, updated_at: r.get(15)?,
                    items,
                })
            },
        )?;
        orders.push(order);
    }
    Ok(orders)
}

pub fn save_order(path: &Path, order: OrderRecord) -> Result<OrderRecord, String> {
    if order.customer_name.trim().is_empty() || order.items.is_empty() {
        return Err("Customer and at least one item are required.".to_string());
    }
    if order.order_date.len() != 10 {
        return Err("Order date must use YYYY-MM-DD format.".to_string());
    }

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;

    let subtotal: f64 = order.items.iter().map(|i| i.quantity as f64 * i.unit_price).sum();
    let total = ((subtotal - order.discount + order.tax).max(0.0) * 100.0).round() / 100.0;

    let order_id = if order.id > 0 {
        transaction.execute(
            "UPDATE orders SET customer_id=?1,customer_name=?2,order_date=?3,
                delivery_date=?4,status=?5,subtotal=?6,discount=?7,tax=?8,
                total=?9,paid_amount=?10,notes=?11,created_by=?12,
                updated_at=CURRENT_TIMESTAMP WHERE id=?13",
            rusqlite::params![
                order.customer_id, order.customer_name.trim(), order.order_date,
                order.delivery_date, order.status, subtotal, order.discount,
                order.tax, total, order.paid_amount, order.notes.trim(),
                order.created_by, order.id
            ],
        ).map_err(|error| error.to_string())?;
        transaction.execute("DELETE FROM order_items WHERE order_id=?1", [order.id])
            .map_err(|error| error.to_string())?;
        order.id
    } else {
        let year = &order.order_date[..4];
        let seq: i64 = transaction.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM orders", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let order_number = format!("ORD-{}-{:05}", year, seq);
        transaction.execute(
            "INSERT INTO orders
                (order_number,customer_id,customer_name,order_date,delivery_date,
                 status,subtotal,discount,tax,total,paid_amount,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)",
            rusqlite::params![
                order_number, order.customer_id, order.customer_name.trim(),
                order.order_date, order.delivery_date, order.status,
                subtotal, order.discount, order.tax, total, order.paid_amount,
                order.notes.trim(), order.created_by
            ],
        ).map_err(|error| error.to_string())?;
        transaction.last_insert_rowid()
    };

    for item in &order.items {
        transaction.execute(
            "INSERT INTO order_items (order_id,brick_grade,quantity,unit_price,total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![order_id, item.brick_grade, item.quantity, item.unit_price,
                item.quantity as f64 * item.unit_price],
        ).map_err(|error| error.to_string())?;
    }

    transaction.commit().map_err(|error| error.to_string())?;
    get_orders(path).map_err(|error| error.to_string())?
        .into_iter().find(|o| o.id == order_id)
        .ok_or_else(|| "Order could not be reloaded.".to_string())
}

pub fn delete_order(path: &Path, order_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM orders WHERE id=?1", [order_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Order not found.".to_string());
    }
    Ok(())
}

pub fn update_order_status(path: &Path, order_id: i64, status: &str) -> Result<OrderRecord, String> {
    let valid = ["draft","pending","confirmed","processing","completed","cancelled"];
    if !valid.contains(&status) {
        return Err("Invalid order status.".to_string());
    }
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let changed = connection.execute(
        "UPDATE orders SET status=?1,updated_at=CURRENT_TIMESTAMP WHERE id=?2",
        rusqlite::params![status, order_id],
    ).map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Order not found.".to_string());
    }
    get_orders(path).map_err(|error| error.to_string())?
        .into_iter().find(|o| o.id == order_id)
        .ok_or_else(|| "Order could not be reloaded.".to_string())
}

// ─── Gate Passes ───────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct GatePassRecord {
    pub id: i64,
    pub pass_number: String,
    pub order_id: Option<i64>,
    pub customer_id: i64,
    pub customer_name: String,
    pub dispatch_date: String,
    pub vehicle_number: String,
    pub driver_name: String,
    pub driver_phone: String,
    pub brick_grade: String,
    pub quantity: i64,
    pub unit: String,
    pub destination: String,
    pub status: String,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_gate_passes(path: &Path) -> Result<Vec<GatePassRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,pass_number,order_id,customer_id,customer_name,dispatch_date,
                vehicle_number,driver_name,driver_phone,brick_grade,quantity,
                unit,destination,status,notes,created_by,created_at
         FROM gate_passes ORDER BY dispatch_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(GatePassRecord {
        id: row.get(0)?, pass_number: row.get(1)?, order_id: row.get(2)?,
        customer_id: row.get(3)?, customer_name: row.get(4)?,
        dispatch_date: row.get(5)?, vehicle_number: row.get(6)?,
        driver_name: row.get(7)?, driver_phone: row.get(8)?,
        brick_grade: row.get(9)?, quantity: row.get(10)?,
        unit: row.get(11)?, destination: row.get(12)?,
        status: row.get(13)?, notes: row.get(14)?,
        created_by: row.get(15)?, created_at: row.get(16)?,
    }))?;
    rows.collect()
}

pub fn save_gate_pass(path: &Path, pass: GatePassRecord) -> Result<GatePassRecord, String> {
    if pass.customer_name.trim().is_empty() || pass.brick_grade.trim().is_empty() {
        return Err("Customer and brick grade are required.".to_string());
    }
    if pass.quantity <= 0 {
        return Err("Quantity must be greater than zero.".to_string());
    }
    if pass.dispatch_date.len() != 10 {
        return Err("Dispatch date must use YYYY-MM-DD format.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let mut pass_id = pass.id;
    if pass.id > 0 {
        connection.execute(
            "UPDATE gate_passes SET order_id=?1,customer_id=?2,customer_name=?3,
                dispatch_date=?4,vehicle_number=?5,driver_name=?6,driver_phone=?7,
                brick_grade=?8,quantity=?9,unit=?10,destination=?11,status=?12,
                notes=?13,created_by=?14
             WHERE id=?15",
            rusqlite::params![
                pass.order_id, pass.customer_id, pass.customer_name.trim(),
                pass.dispatch_date, pass.vehicle_number.trim(),
                pass.driver_name.trim(), pass.driver_phone.trim(),
                pass.brick_grade.trim(), pass.quantity, pass.unit.trim(),
                pass.destination.trim(), pass.status, pass.notes.trim(),
                pass.created_by, pass.id
            ],
        ).map_err(|error| error.to_string())?;
    } else {
        let year = &pass.dispatch_date[..4];
        let seq: i64 = connection.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM gate_passes", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let pass_number = format!("GP-{}-{:05}", year, seq);
        connection.execute(
            "INSERT INTO gate_passes
                (pass_number,order_id,customer_id,customer_name,dispatch_date,
                 vehicle_number,driver_name,driver_phone,brick_grade,quantity,
                 unit,destination,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)",
            rusqlite::params![
                pass_number, pass.order_id, pass.customer_id,
                pass.customer_name.trim(), pass.dispatch_date,
                pass.vehicle_number.trim(), pass.driver_name.trim(),
                pass.driver_phone.trim(), pass.brick_grade.trim(),
                pass.quantity, pass.unit.trim(), pass.destination.trim(),
                pass.status, pass.notes.trim(), pass.created_by
            ],
        ).map_err(|error| error.to_string())?;
        pass_id = connection.last_insert_rowid();
    }
    get_gate_passes(path).map_err(|error| error.to_string())?
        .into_iter().find(|p| p.id == pass_id)
        .ok_or_else(|| "Gate pass could not be reloaded.".to_string())
}

pub fn delete_gate_pass(path: &Path, pass_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM gate_passes WHERE id=?1", [pass_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Gate pass not found.".to_string());
    }
    Ok(())
}

pub fn update_gate_pass_status(path: &Path, pass_id: i64, status: &str) -> Result<GatePassRecord, String> {
    let valid = ["prepared","approved","dispatched","delivered","cancelled"];
    if !valid.contains(&status) {
        return Err("Invalid gate pass status.".to_string());
    }
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let changed = connection.execute(
        "UPDATE gate_passes SET status=?1 WHERE id=?2",
        rusqlite::params![status, pass_id],
    ).map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Gate pass not found.".to_string());
    }
    get_gate_passes(path).map_err(|error| error.to_string())?
        .into_iter().find(|p| p.id == pass_id)
        .ok_or_else(|| "Gate pass could not be reloaded.".to_string())
}

// ─── Suppliers ─────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct SupplierRecord {
    pub id: i64,
    pub supplier_code: String,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
    pub city: String,
    pub credit_limit: f64,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub outstanding_balance: f64,
}

pub fn get_suppliers(path: &Path) -> Result<Vec<SupplierRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT s.id,s.supplier_code,s.name,s.phone,s.email,s.address,s.city,
                s.credit_limit,s.status,
                COALESCE((SELECT SUM(p.total - p.paid_amount) FROM purchases p
                          WHERE p.supplier_id=s.id AND p.status!='cancelled'),0),
                s.created_at,s.updated_at
         FROM suppliers s ORDER BY s.name COLLATE NOCASE",
    )?;
    let rows = statement.query_map([], |row| Ok(SupplierRecord {
        id: row.get(0)?, supplier_code: row.get(1)?, name: row.get(2)?,
        phone: row.get(3)?, email: row.get(4)?, address: row.get(5)?,
        city: row.get(6)?, credit_limit: row.get(7)?, status: row.get(8)?,
        outstanding_balance: row.get(9)?, created_at: row.get(10)?,
        updated_at: row.get(11)?,
    }))?;
    rows.collect()
}

pub fn save_supplier(path: &Path, supplier: SupplierRecord) -> Result<SupplierRecord, String> {
    if supplier.name.trim().is_empty() {
        return Err("Supplier name is required.".to_string());
    }
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    if supplier.id > 0 {
        connection.execute(
            "UPDATE suppliers SET supplier_code=?1,name=?2,phone=?3,email=?4,
                address=?5,city=?6,credit_limit=?7,status=?8,updated_at=CURRENT_TIMESTAMP
             WHERE id=?9",
            rusqlite::params![
                supplier.supplier_code, supplier.name.trim(), supplier.phone.trim(),
                supplier.email.trim(), supplier.address.trim(), supplier.city.trim(),
                supplier.credit_limit, supplier.status, supplier.id
            ],
        ).map_err(|error| error.to_string())?;
    } else {
        let next: i64 = connection.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM suppliers", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let code = if supplier.supplier_code.trim().is_empty() {
            format!("SUP-{:05}", next)
        } else {
            supplier.supplier_code.trim().to_string()
        };
        connection.execute(
            "INSERT INTO suppliers
                (supplier_code,name,phone,email,address,city,credit_limit,status)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                code, supplier.name.trim(), supplier.phone.trim(),
                supplier.email.trim(), supplier.address.trim(), supplier.city.trim(),
                supplier.credit_limit, supplier.status
            ],
        ).map_err(|error| error.to_string())?;
    }
    get_suppliers(path).map_err(|error| error.to_string())?
        .into_iter().find(|s| s.name == supplier.name.trim())
        .ok_or_else(|| "Supplier could not be reloaded.".to_string())
}

pub fn delete_supplier(path: &Path, supplier_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM suppliers WHERE id=?1", [supplier_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Supplier not found.".to_string());
    }
    Ok(())
}

// ─── Payments ──────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct PaymentRecord {
    pub id: i64,
    pub payment_number: String,
    pub payment_type: String,
    pub party_type: String,
    pub party_id: i64,
    pub party_name: String,
    pub payment_date: String,
    pub amount: f64,
    pub payment_method: String,
    pub reference: String,
    pub notes: String,
    pub status: String,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_payments(path: &Path) -> Result<Vec<PaymentRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,payment_number,payment_type,party_type,party_id,party_name,
                payment_date,amount,payment_method,reference,notes,status,
                created_by,created_at
         FROM payments ORDER BY payment_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(PaymentRecord {
        id: row.get(0)?, payment_number: row.get(1)?, payment_type: row.get(2)?,
        party_type: row.get(3)?, party_id: row.get(4)?, party_name: row.get(5)?,
        payment_date: row.get(6)?, amount: row.get(7)?, payment_method: row.get(8)?,
        reference: row.get(9)?, notes: row.get(10)?, status: row.get(11)?,
        created_by: row.get(12)?, created_at: row.get(13)?,
    }))?;
    rows.collect()
}

pub fn save_payment(path: &Path, payment: PaymentRecord) -> Result<PaymentRecord, String> {
    if payment.party_name.trim().is_empty() || payment.amount <= 0.0 {
        return Err("Party and a positive amount are required.".to_string());
    }
    if payment.payment_date.len() != 10 {
        return Err("Payment date must use YYYY-MM-DD format.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let year = &payment.payment_date[..4];
    let seq: i64 = connection.query_row(
        "SELECT COALESCE(MAX(id),0)+1 FROM payments", [], |r| r.get(0),
    ).map_err(|error| error.to_string())?;
    let payment_number = format!("PAY-{}-{:05}", year, seq);

    connection.execute(
        "INSERT INTO payments
            (payment_number,payment_type,party_type,party_id,party_name,
             payment_date,amount,payment_method,reference,notes,status,created_by)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)",
        rusqlite::params![
            payment_number, payment.payment_type, payment.party_type,
            payment.party_id, payment.party_name.trim(), payment.payment_date,
            payment.amount, payment.payment_method.trim(), payment.reference.trim(),
            payment.notes.trim(), payment.status, payment.created_by
        ],
    ).map_err(|error| error.to_string())?;

    get_payments(path).map_err(|error| error.to_string())?
        .into_iter().find(|p| p.payment_number == payment_number)
        .ok_or_else(|| "Payment could not be reloaded.".to_string())
}

pub fn delete_payment(path: &Path, payment_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM payments WHERE id=?1", [payment_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Payment not found.".to_string());
    }
    Ok(())
}

// ─── Wages ─────────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct WageRecord {
    pub id: i64,
    pub wage_number: String,
    pub worker_id: i64,
    pub worker_name: String,
    pub period_start: String,
    pub period_end: String,
    pub total_days: i64,
    pub daily_wage: f64,
    pub total_amount: f64,
    pub advances: f64,
    pub deductions: f64,
    pub net_amount: f64,
    pub status: String,
    pub payment_date: Option<String>,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_wages(path: &Path) -> Result<Vec<WageRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,wage_number,worker_id,worker_name,period_start,period_end,
                total_days,daily_wage,total_amount,advances,deductions,
                net_amount,status,payment_date,notes,created_by,created_at
         FROM wages ORDER BY period_end DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(WageRecord {
        id: row.get(0)?, wage_number: row.get(1)?, worker_id: row.get(2)?,
        worker_name: row.get(3)?, period_start: row.get(4)?, period_end: row.get(5)?,
        total_days: row.get(6)?, daily_wage: row.get(7)?, total_amount: row.get(8)?,
        advances: row.get(9)?, deductions: row.get(10)?, net_amount: row.get(11)?,
        status: row.get(12)?, payment_date: row.get(13)?, notes: row.get(14)?,
        created_by: row.get(15)?, created_at: row.get(16)?,
    }))?;
    rows.collect()
}

pub fn save_wage(path: &Path, wage: WageRecord) -> Result<WageRecord, String> {
    if wage.worker_name.trim().is_empty() {
        return Err("Worker name is required.".to_string());
    }
    if wage.period_start.len() != 10 || wage.period_end.len() != 10 {
        return Err("Period dates must use YYYY-MM-DD format.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let net = ((wage.total_amount - wage.advances - wage.deductions).max(0.0) * 100.0).round() / 100.0;

    if wage.id > 0 {
        connection.execute(
            "UPDATE wages SET worker_id=?1,worker_name=?2,period_start=?3,period_end=?4,
                total_days=?5,daily_wage=?6,total_amount=?7,advances=?8,deductions=?9,
                net_amount=?10,status=?11,payment_date=?12,notes=?13,created_by=?14
             WHERE id=?15",
            rusqlite::params![
                wage.worker_id, wage.worker_name.trim(), wage.period_start,
                wage.period_end, wage.total_days, wage.daily_wage, wage.total_amount,
                wage.advances, wage.deductions, net, wage.status,
                wage.payment_date, wage.notes.trim(), wage.created_by, wage.id
            ],
        ).map_err(|error| error.to_string())?;
    } else {
        let year = &wage.period_start[..4];
        let seq: i64 = connection.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM wages", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let wage_number = format!("WAGE-{}-{:05}", year, seq);
        connection.execute(
            "INSERT INTO wages
                (wage_number,worker_id,worker_name,period_start,period_end,
                 total_days,daily_wage,total_amount,advances,deductions,
                 net_amount,status,payment_date,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)",
            rusqlite::params![
                wage_number, wage.worker_id, wage.worker_name.trim(),
                wage.period_start, wage.period_end, wage.total_days, wage.daily_wage,
                wage.total_amount, wage.advances, wage.deductions, net,
                wage.status, wage.payment_date, wage.notes.trim(), wage.created_by
            ],
        ).map_err(|error| error.to_string())?;
    }
    get_wages(path).map_err(|error| error.to_string())?
        .into_iter().find(|w| w.worker_name == wage.worker_name.trim() && w.period_start == wage.period_start)
        .ok_or_else(|| "Wage could not be reloaded.".to_string())
}

pub fn update_wage_status(path: &Path, wage_id: i64, status: &str, payment_date: Option<String>) -> Result<WageRecord, String> {
    if !["pending","paid","cancelled"].contains(&status) {
        return Err("Invalid wage status.".to_string());
    }
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let changed = connection.execute(
        "UPDATE wages SET status=?1,payment_date=?2 WHERE id=?3",
        rusqlite::params![status, payment_date, wage_id],
    ).map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Wage record not found.".to_string());
    }
    get_wages(path).map_err(|error| error.to_string())?
        .into_iter().find(|w| w.id == wage_id)
        .ok_or_else(|| "Wage could not be reloaded.".to_string())
}

// ─── Expenses ──────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct ExpenseRecord {
    pub id: i64,
    pub expense_number: String,
    pub category: String,
    pub amount: f64,
    pub expense_date: String,
    pub description: String,
    pub payment_method: String,
    pub status: String,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_expenses(path: &Path) -> Result<Vec<ExpenseRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,expense_number,category,amount,expense_date,description,
                payment_method,status,created_by,created_at
         FROM expenses ORDER BY expense_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(ExpenseRecord {
        id: row.get(0)?, expense_number: row.get(1)?, category: row.get(2)?,
        amount: row.get(3)?, expense_date: row.get(4)?, description: row.get(5)?,
        payment_method: row.get(6)?, status: row.get(7)?, created_by: row.get(8)?,
        created_at: row.get(9)?,
    }))?;
    rows.collect()
}

pub fn save_expense(path: &Path, expense: ExpenseRecord) -> Result<ExpenseRecord, String> {
    if expense.category.trim().is_empty() || expense.amount <= 0.0 {
        return Err("Category and a positive amount are required.".to_string());
    }
    if expense.expense_date.len() != 10 {
        return Err("Expense date must use YYYY-MM-DD format.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let year = &expense.expense_date[..4];
    let seq: i64 = connection.query_row(
        "SELECT COALESCE(MAX(id),0)+1 FROM expenses", [], |r| r.get(0),
    ).map_err(|error| error.to_string())?;
    let expense_number = format!("EXP-{}-{:05}", year, seq);

    connection.execute(
        "INSERT INTO expenses
            (expense_number,category,amount,expense_date,description,
             payment_method,status,created_by)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
        rusqlite::params![
            expense_number, expense.category.trim(), expense.amount,
            expense.expense_date, expense.description.trim(),
            expense.payment_method.trim(), expense.status, expense.created_by
        ],
    ).map_err(|error| error.to_string())?;

    get_expenses(path).map_err(|error| error.to_string())?
        .into_iter().find(|e| e.expense_number == expense_number)
        .ok_or_else(|| "Expense could not be reloaded.".to_string())
}

pub fn delete_expense(path: &Path, expense_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM expenses WHERE id=?1", [expense_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Expense not found.".to_string());
    }
    Ok(())
}

// ─── Purchases ─────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct PurchaseItemRecord {
    pub id: i64,
    pub item_name: String,
    pub quantity: f64,
    pub unit: String,
    pub unit_price: f64,
    pub total: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PurchaseRecord {
    pub id: i64,
    pub purchase_number: String,
    pub supplier_id: i64,
    pub supplier_name: String,
    pub purchase_date: String,
    pub subtotal: f64,
    pub tax: f64,
    pub total: f64,
    pub paid_amount: f64,
    pub payment_status: String,
    pub status: String,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
    pub items: Vec<PurchaseItemRecord>,
}

pub fn get_purchases(path: &Path) -> Result<Vec<PurchaseRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id FROM purchases ORDER BY purchase_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| row.get::<_, i64>(0))?;
    let mut purchases = Vec::new();
    for row in rows {
        let id = row?;
        let purchase = connection.query_row(
            "SELECT id,purchase_number,supplier_id,supplier_name,purchase_date,
                    subtotal,tax,total,paid_amount,payment_status,status,notes,
                    created_by,created_at
             FROM purchases WHERE id=?1",
            [id],
            |r| {
                let mut items_stmt = connection.prepare(
                    "SELECT id,item_name,quantity,unit,unit_price,total
                     FROM purchase_items WHERE purchase_id=?1",
                ).map_err(rusqlite::Error::from)?;
                let item_rows = items_stmt.query_map([id], |ir| {
                    Ok(PurchaseItemRecord {
                        id: ir.get(0)?, item_name: ir.get(1)?,
                        quantity: ir.get(2)?, unit: ir.get(3)?,
                        unit_price: ir.get(4)?, total: ir.get(5)?,
                    })
                })?;
                let mut items = Vec::new();
                for item in item_rows { items.push(item?); }
                Ok(PurchaseRecord {
                    id: r.get(0)?, purchase_number: r.get(1)?,
                    supplier_id: r.get(2)?, supplier_name: r.get(3)?,
                    purchase_date: r.get(4)?, subtotal: r.get(5)?,
                    tax: r.get(6)?, total: r.get(7)?,
                    paid_amount: r.get(8)?, payment_status: r.get(9)?,
                    status: r.get(10)?, notes: r.get(11)?,
                    created_by: r.get(12)?, created_at: r.get(13)?,
                    items,
                })
            },
        )?;
        purchases.push(purchase);
    }
    Ok(purchases)
}

pub fn save_purchase(path: &Path, purchase: PurchaseRecord) -> Result<PurchaseRecord, String> {
    if purchase.supplier_name.trim().is_empty() || purchase.items.is_empty() {
        return Err("Supplier and at least one item are required.".to_string());
    }
    if purchase.purchase_date.len() != 10 {
        return Err("Purchase date must use YYYY-MM-DD format.".to_string());
    }

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;

    let subtotal: f64 = purchase.items.iter().map(|i| i.quantity * i.unit_price).sum();
    let total = ((subtotal + purchase.tax).max(0.0) * 100.0).round() / 100.0;

    let purchase_id = if purchase.id > 0 {
        transaction.execute(
            "UPDATE purchases SET supplier_id=?1,supplier_name=?2,purchase_date=?3,
                subtotal=?4,tax=?5,total=?6,paid_amount=?7,payment_status=?8,
                status=?9,notes=?10,created_by=?11
             WHERE id=?12",
            rusqlite::params![
                purchase.supplier_id, purchase.supplier_name.trim(),
                purchase.purchase_date, subtotal, purchase.tax, total,
                purchase.paid_amount, purchase.payment_status, purchase.status,
                purchase.notes.trim(), purchase.created_by, purchase.id
            ],
        ).map_err(|error| error.to_string())?;
        transaction.execute("DELETE FROM purchase_items WHERE purchase_id=?1", [purchase.id])
            .map_err(|error| error.to_string())?;
        purchase.id
    } else {
        let year = &purchase.purchase_date[..4];
        let seq: i64 = transaction.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM purchases", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let purchase_number = format!("PUR-{}-{:05}", year, seq);
        transaction.execute(
            "INSERT INTO purchases
                (purchase_number,supplier_id,supplier_name,purchase_date,
                 subtotal,tax,total,paid_amount,payment_status,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)",
            rusqlite::params![
                purchase_number, purchase.supplier_id, purchase.supplier_name.trim(),
                purchase.purchase_date, subtotal, purchase.tax, total,
                purchase.paid_amount, purchase.payment_status, purchase.status,
                purchase.notes.trim(), purchase.created_by
            ],
        ).map_err(|error| error.to_string())?;
        transaction.last_insert_rowid()
    };

    for item in &purchase.items {
        transaction.execute(
            "INSERT INTO purchase_items (purchase_id,item_name,quantity,unit,unit_price,total)
             VALUES (?1,?2,?3,?4,?5,?6)",
            rusqlite::params![
                purchase_id, item.item_name, item.quantity, item.unit,
                item.unit_price, item.quantity * item.unit_price
            ],
        ).map_err(|error| error.to_string())?;
    }

    transaction.commit().map_err(|error| error.to_string())?;
    get_purchases(path).map_err(|error| error.to_string())?
        .into_iter().find(|p| p.id == purchase_id)
        .ok_or_else(|| "Purchase could not be reloaded.".to_string())
}

// ─── Coal & Fuel ───────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct CoalFuelRecord {
    pub id: i64,
    pub fuel_type: String,
    pub quantity: f64,
    pub unit: String,
    pub purchase_date: String,
    pub supplier: String,
    pub cost: f64,
    pub status: String,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_coal_fuel(path: &Path) -> Result<Vec<CoalFuelRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,fuel_type,quantity,unit,purchase_date,supplier,cost,
                status,notes,created_by,created_at
         FROM coal_fuel ORDER BY purchase_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(CoalFuelRecord {
        id: row.get(0)?, fuel_type: row.get(1)?, quantity: row.get(2)?,
        unit: row.get(3)?, purchase_date: row.get(4)?, supplier: row.get(5)?,
        cost: row.get(6)?, status: row.get(7)?, notes: row.get(8)?,
        created_by: row.get(9)?, created_at: row.get(10)?,
    }))?;
    rows.collect()
}

pub fn save_coal_fuel(path: &Path, fuel: CoalFuelRecord) -> Result<CoalFuelRecord, String> {
    if fuel.fuel_type.trim().is_empty() || fuel.quantity <= 0.0 {
        return Err("Fuel type and a positive quantity are required.".to_string());
    }
    if fuel.purchase_date.len() != 10 {
        return Err("Purchase date must use YYYY-MM-DD format.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    if fuel.id > 0 {
        connection.execute(
            "UPDATE coal_fuel SET fuel_type=?1,quantity=?2,unit=?3,purchase_date=?4,
                supplier=?5,cost=?6,status=?7,notes=?8,created_by=?9
             WHERE id=?10",
            rusqlite::params![
                fuel.fuel_type.trim(), fuel.quantity, fuel.unit.trim(),
                fuel.purchase_date, fuel.supplier.trim(), fuel.cost,
                fuel.status, fuel.notes.trim(), fuel.created_by, fuel.id
            ],
        ).map_err(|error| error.to_string())?;
    } else {
        connection.execute(
            "INSERT INTO coal_fuel
                (fuel_type,quantity,unit,purchase_date,supplier,cost,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
            rusqlite::params![
                fuel.fuel_type.trim(), fuel.quantity, fuel.unit.trim(),
                fuel.purchase_date, fuel.supplier.trim(), fuel.cost,
                fuel.status, fuel.notes.trim(), fuel.created_by
            ],
        ).map_err(|error| error.to_string())?;
    }
    get_coal_fuel(path).map_err(|error| error.to_string())?
        .into_iter().find(|f| f.fuel_type == fuel.fuel_type.trim() && f.purchase_date == fuel.purchase_date)
        .ok_or_else(|| "Fuel record could not be reloaded.".to_string())
}

pub fn delete_coal_fuel(path: &Path, fuel_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM coal_fuel WHERE id=?1", [fuel_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Fuel record not found.".to_string());
    }
    Ok(())
}

// ─── Transport ─────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct TransportRecord {
    pub id: i64,
    pub trip_number: String,
    pub vehicle_number: String,
    pub driver_name: String,
    pub driver_phone: String,
    pub trip_date: String,
    pub route: String,
    pub bricks_transported: i64,
    pub cost: f64,
    pub status: String,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_transport(path: &Path) -> Result<Vec<TransportRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,trip_number,vehicle_number,driver_name,driver_phone,
                trip_date,route,bricks_transported,cost,status,notes,
                created_by,created_at
         FROM transport ORDER BY trip_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(TransportRecord {
        id: row.get(0)?, trip_number: row.get(1)?, vehicle_number: row.get(2)?,
        driver_name: row.get(3)?, driver_phone: row.get(4)?, trip_date: row.get(5)?,
        route: row.get(6)?, bricks_transported: row.get(7)?, cost: row.get(8)?,
        status: row.get(9)?, notes: row.get(10)?, created_by: row.get(11)?,
        created_at: row.get(12)?,
    }))?;
    rows.collect()
}

pub fn save_transport(path: &Path, trip: TransportRecord) -> Result<TransportRecord, String> {
    if trip.vehicle_number.trim().is_empty() || trip.driver_name.trim().is_empty() {
        return Err("Vehicle number and driver name are required.".to_string());
    }
    if trip.trip_date.len() != 10 {
        return Err("Trip date must use YYYY-MM-DD format.".to_string());
    }

    let connection = open_connection(path).map_err(|error| error.to_string())?;
    if trip.id > 0 {
        connection.execute(
            "UPDATE transport SET vehicle_number=?1,driver_name=?2,driver_phone=?3,
                trip_date=?4,route=?5,bricks_transported=?6,cost=?7,status=?8,
                notes=?9,created_by=?10
             WHERE id=?11",
            rusqlite::params![
                trip.vehicle_number.trim(), trip.driver_name.trim(),
                trip.driver_phone.trim(), trip.trip_date, trip.route.trim(),
                trip.bricks_transported, trip.cost, trip.status,
                trip.notes.trim(), trip.created_by, trip.id
            ],
        ).map_err(|error| error.to_string())?;
    } else {
        let year = &trip.trip_date[..4];
        let seq: i64 = connection.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM transport", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let trip_number = format!("TRP-{}-{:05}", year, seq);
        connection.execute(
            "INSERT INTO transport
                (trip_number,vehicle_number,driver_name,driver_phone,trip_date,
                 route,bricks_transported,cost,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
            rusqlite::params![
                trip_number, trip.vehicle_number.trim(), trip.driver_name.trim(),
                trip.driver_phone.trim(), trip.trip_date, trip.route.trim(),
                trip.bricks_transported, trip.cost, trip.status,
                trip.notes.trim(), trip.created_by
            ],
        ).map_err(|error| error.to_string())?;
    }
    get_transport(path).map_err(|error| error.to_string())?
        .into_iter().find(|t| t.vehicle_number == trip.vehicle_number.trim() && t.trip_date == trip.trip_date)
        .ok_or_else(|| "Transport record could not be reloaded.".to_string())
}

pub fn delete_transport(path: &Path, trip_id: i64) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let deleted = connection.execute("DELETE FROM transport WHERE id=?1", [trip_id])
        .map_err(|error| error.to_string())?;
    if deleted == 0 {
        return Err("Transport record not found.".to_string());
    }
    Ok(())
}

// ─── Invoices ──────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct InvoiceItemRecord {
    pub id: i64,
    pub brick_grade: String,
    pub quantity: i64,
    pub unit_price: f64,
    pub total: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct InvoiceRecord {
    pub id: i64,
    pub invoice_number: String,
    pub customer_id: i64,
    pub customer_name: String,
    pub invoice_date: String,
    pub due_date: String,
    pub amount: f64,
    pub paid_amount: f64,
    pub balance: f64,
    pub status: String,
    pub notes: String,
    pub created_by: String,
    pub created_at: String,
    pub items: Vec<InvoiceItemRecord>,
}

pub fn get_invoices(path: &Path) -> Result<Vec<InvoiceRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id FROM invoices ORDER BY invoice_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| row.get::<_, i64>(0))?;
    let mut invoices = Vec::new();
    for row in rows {
        let id = row?;
        let invoice = connection.query_row(
            "SELECT id,invoice_number,customer_id,customer_name,invoice_date,
                    due_date,amount,paid_amount,balance,status,notes,
                    created_by,created_at
             FROM invoices WHERE id=?1",
            [id],
            |r| {
                let mut items_stmt = connection.prepare(
                    "SELECT id,brick_grade,quantity,unit_price,total
                     FROM invoice_items WHERE invoice_id=?1",
                ).map_err(rusqlite::Error::from)?;
                let item_rows = items_stmt.query_map([id], |ir| {
                    Ok(InvoiceItemRecord {
                        id: ir.get(0)?, brick_grade: ir.get(1)?,
                        quantity: ir.get(2)?, unit_price: ir.get(3)?,
                        total: ir.get(4)?,
                    })
                })?;
                let mut items = Vec::new();
                for item in item_rows { items.push(item?); }
                Ok(InvoiceRecord {
                    id: r.get(0)?, invoice_number: r.get(1)?,
                    customer_id: r.get(2)?, customer_name: r.get(3)?,
                    invoice_date: r.get(4)?, due_date: r.get(5)?,
                    amount: r.get(6)?, paid_amount: r.get(7)?,
                    balance: r.get(8)?, status: r.get(9)?,
                    notes: r.get(10)?, created_by: r.get(11)?,
                    created_at: r.get(12)?, items,
                })
            },
        )?;
        invoices.push(invoice);
    }
    Ok(invoices)
}

pub fn save_invoice(path: &Path, invoice: InvoiceRecord) -> Result<InvoiceRecord, String> {
    if invoice.customer_name.trim().is_empty() || invoice.items.is_empty() {
        return Err("Customer and at least one item are required.".to_string());
    }
    if invoice.invoice_date.len() != 10 || invoice.due_date.len() != 10 {
        return Err("Dates must use YYYY-MM-DD format.".to_string());
    }

    let mut connection = open_connection(path).map_err(|error| error.to_string())?;
    let transaction = connection.transaction().map_err(|error| error.to_string())?;

    let amount: f64 = invoice.items.iter().map(|i| i.quantity as f64 * i.unit_price).sum();
    let balance = ((amount - invoice.paid_amount).max(0.0) * 100.0).round() / 100.0;

    let invoice_id = if invoice.id > 0 {
        transaction.execute(
            "UPDATE invoices SET customer_id=?1,customer_name=?2,invoice_date=?3,
                due_date=?4,amount=?5,paid_amount=?6,balance=?7,status=?8,
                notes=?9,created_by=?10
             WHERE id=?11",
            rusqlite::params![
                invoice.customer_id, invoice.customer_name.trim(),
                invoice.invoice_date, invoice.due_date, amount,
                invoice.paid_amount, balance, invoice.status,
                invoice.notes.trim(), invoice.created_by, invoice.id
            ],
        ).map_err(|error| error.to_string())?;
        transaction.execute("DELETE FROM invoice_items WHERE invoice_id=?1", [invoice.id])
            .map_err(|error| error.to_string())?;
        invoice.id
    } else {
        let year = &invoice.invoice_date[..4];
        let seq: i64 = transaction.query_row(
            "SELECT COALESCE(MAX(id),0)+1 FROM invoices", [], |r| r.get(0),
        ).map_err(|error| error.to_string())?;
        let invoice_number = format!("INV-{}-{:05}", year, seq);
        transaction.execute(
            "INSERT INTO invoices
                (invoice_number,customer_id,customer_name,invoice_date,due_date,
                 amount,paid_amount,balance,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
            rusqlite::params![
                invoice_number, invoice.customer_id, invoice.customer_name.trim(),
                invoice.invoice_date, invoice.due_date, amount,
                invoice.paid_amount, balance, invoice.status,
                invoice.notes.trim(), invoice.created_by
            ],
        ).map_err(|error| error.to_string())?;
        transaction.last_insert_rowid()
    };

    for item in &invoice.items {
        transaction.execute(
            "INSERT INTO invoice_items (invoice_id,brick_grade,quantity,unit_price,total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![
                invoice_id, item.brick_grade, item.quantity,
                item.unit_price, item.quantity as f64 * item.unit_price
            ],
        ).map_err(|error| error.to_string())?;
    }

    transaction.commit().map_err(|error| error.to_string())?;
    get_invoices(path).map_err(|error| error.to_string())?
        .into_iter().find(|i| i.id == invoice_id)
        .ok_or_else(|| "Invoice could not be reloaded.".to_string())
}

// ─── Cashbook ──────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct CashbookRecord {
    pub id: i64,
    pub entry_date: String,
    pub description: String,
    pub entry_type: String,
    pub amount: f64,
    pub balance: f64,
    pub reference_type: String,
    pub reference_id: Option<i64>,
    pub created_by: String,
    pub created_at: String,
}

pub fn get_cashbook(path: &Path) -> Result<Vec<CashbookRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,entry_date,description,type,amount,balance,
                reference_type,reference_id,created_by,created_at
         FROM cashbook ORDER BY entry_date DESC, id DESC",
    )?;
    let rows = statement.query_map([], |row| Ok(CashbookRecord {
        id: row.get(0)?, entry_date: row.get(1)?, description: row.get(2)?,
        entry_type: row.get(3)?, amount: row.get(4)?, balance: row.get(5)?,
        reference_type: row.get(6)?, reference_id: row.get(7)?,
        created_by: row.get(8)?, created_at: row.get(9)?,
    }))?;
    rows.collect()
}

// ─── Audit Logs ────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct AuditLogRecord {
    pub id: i64,
    pub user_id: i64,
    pub username: String,
    pub action: String,
    pub module: String,
    pub record_id: Option<i64>,
    pub old_values: Option<String>,
    pub new_values: Option<String>,
    pub ip_address: String,
    pub created_at: String,
}

pub fn get_audit_logs(path: &Path, limit: i64) -> Result<Vec<AuditLogRecord>> {
    let connection = open_connection(path)?;
    let mut statement = connection.prepare(
        "SELECT id,user_id,username,action,module,record_id,old_values,
                new_values,ip_address,created_at
         FROM audit_logs ORDER BY created_at DESC, id DESC LIMIT ?1",
    )?;
    let rows = statement.query_map([limit], |row| Ok(AuditLogRecord {
        id: row.get(0)?, user_id: row.get(1)?, username: row.get(2)?,
        action: row.get(3)?, module: row.get(4)?, record_id: row.get(5)?,
        old_values: row.get(6)?, new_values: row.get(7)?,
        ip_address: row.get(8)?, created_at: row.get(9)?,
    }))?;
    rows.collect()
}

pub fn create_audit_log(
    path: &Path,
    user_id: i64,
    username: &str,
    action: &str,
    module: &str,
    record_id: Option<i64>,
    old_values: Option<&str>,
    new_values: Option<&str>,
) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    connection.execute(
        "INSERT INTO audit_logs
            (user_id,username,action,module,record_id,old_values,new_values)
         VALUES (?1,?2,?3,?4,?5,?6,?7)",
        rusqlite::params![
            user_id, username, action, module, record_id,
            old_values, new_values
        ],
    ).map_err(|error| error.to_string())?;
    Ok(())
}

// ─── Dashboard Data ────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct DashboardData {
    pub total_sales: f64,
    pub total_orders: i64,
    pub total_customers: i64,
    pub total_inventory: i64,
    pub total_workers: i64,
    pub pending_orders: i64,
    pub pending_payments: f64,
    pub total_expenses: f64,
    pub total_purchases: f64,
    pub total_production: i64,
    pub low_stock_count: i64,
    pub recent_sales: Vec<SaleRecord>,
    pub recent_orders: Vec<OrderRecord>,
    pub recent_payments: Vec<PaymentRecord>,
    pub recent_expenses: Vec<ExpenseRecord>,
}

pub fn get_dashboard_data(path: &Path) -> Result<DashboardData> {
    let connection = open_connection(path)?;

    let total_sales: f64 = connection.query_row(
        "SELECT COALESCE(SUM(grand_total),0) FROM sales WHERE status!='cancelled'",
        [], |r| r.get(0),
    )?;

    let total_orders: i64 = connection.query_row(
        "SELECT COUNT(*) FROM orders", [], |r| r.get(0),
    )?;

    let pending_orders: i64 = connection.query_row(
        "SELECT COUNT(*) FROM orders WHERE status IN ('pending','confirmed','processing')",
        [], |r| r.get(0),
    )?;

    let total_customers: i64 = connection.query_row(
        "SELECT COUNT(*) FROM customers WHERE status='active'", [], |r| r.get(0),
    )?;

    let total_inventory: i64 = connection.query_row(
        "SELECT COALESCE(SUM(quantity),0) FROM inventory", [], |r| r.get(0),
    )?;

    let total_workers: i64 = connection.query_row(
        "SELECT COUNT(*) FROM workers WHERE status='active'", [], |r| r.get(0),
    )?;

    let pending_payments: f64 = connection.query_row(
        "SELECT COALESCE(SUM(due_amount),0) FROM sales WHERE status!='cancelled' AND due_amount>0",
        [], |r| r.get(0),
    )?;

    let total_expenses: f64 = connection.query_row(
        "SELECT COALESCE(SUM(amount),0) FROM expenses WHERE status='approved'",
        [], |r| r.get(0),
    )?;

    let total_purchases: f64 = connection.query_row(
        "SELECT COALESCE(SUM(total),0) FROM purchases WHERE status='completed'",
        [], |r| r.get(0),
    )?;

    let total_production: i64 = connection.query_row(
        "SELECT COALESCE(SUM(produced_quantity),0) FROM production_batches WHERE status='completed'",
        [], |r| r.get(0),
    )?;

    let low_stock_count: i64 = connection.query_row(
        "SELECT COUNT(*) FROM inventory WHERE quantity <= reorder_level",
        [], |r| r.get(0),
    )?;

    let mut recent_sales = get_sales(path).unwrap_or_default();
    recent_sales.truncate(5);

    let mut recent_orders = get_orders(path).unwrap_or_default();
    recent_orders.truncate(5);

    let mut recent_payments = get_payments(path).unwrap_or_default();
    recent_payments.truncate(5);

    let mut recent_expenses = get_expenses(path).unwrap_or_default();
    recent_expenses.truncate(5);

    Ok(DashboardData {
        total_sales,
        total_orders,
        total_customers,
        total_inventory,
        total_workers,
        pending_orders,
        pending_payments,
        total_expenses,
        total_purchases,
        total_production,
        low_stock_count,
        recent_sales,
        recent_orders,
        recent_payments,
        recent_expenses,
    })
}

// ─── Admin Functions ───────────────────────────────────────────────────────

pub fn ensure_admin_user(path: &Path) -> Result<(), String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let admin_exists: i64 = connection.query_row(
        "SELECT COUNT(*) FROM users WHERE username='admin'",
        [], |r| r.get(0),
    ).map_err(|error| error.to_string())?;

    if admin_exists == 0 {
        let password_hash = hash_password("adminbrick").map_err(|e| e.to_string())?;
        connection.execute(
            "INSERT INTO users (username,full_name,password_hash,role,is_active)
             VALUES ('admin','Administrator',?1,'admin',1)",
            [password_hash],
        ).map_err(|error| error.to_string())?;
    }
    Ok(())
}

pub fn change_admin_password(path: &Path, old_password: &str, new_password: &str) -> Result<(), String> {
    if new_password.len() < 6 {
        return Err("New password must be at least 6 characters.".to_string());
    }
    let connection = open_connection(path).map_err(|error| error.to_string())?;
    let (user_id, password_hash): (i64, String) = connection.query_row(
        "SELECT id,password_hash FROM users WHERE username='admin'",
        [], |r| Ok((r.get(0)?, r.get(1)?)),
    ).map_err(|_| "Admin user not found.".to_string())?;

    if !verify_password(old_password, &password_hash) {
        return Err("Current password is incorrect.".to_string());
    }

    let new_hash = hash_password(new_password).map_err(|e| e.to_string())?;
    connection.execute(
        "UPDATE users SET password_hash=?1,updated_at=CURRENT_TIMESTAMP WHERE id=?2",
        rusqlite::params![new_hash, user_id],
    ).map_err(|error| error.to_string())?;
    Ok(())
}

pub fn get_admin_sales_summary(path: &Path, days: i64) -> Result<Vec<SaleRecord>, String> {
    let sales = get_sales(path).map_err(|error| error.to_string())?;
    let cutoff = {
        let connection = open_connection(path).map_err(|error| error.to_string())?;
        connection.query_row(
            "SELECT date('now', ?1)",
            [format!("-{} days", days)],
            |r| r.get::<_, String>(0),
        ).map_err(|error| error.to_string())?
    };
    Ok(sales.into_iter()
        .filter(|s| s.sale_date >= cutoff && s.status != "cancelled")
        .collect())
}

// ─── Seed Data ─────────────────────────────────────────────────────────────

pub fn seed_test_data(path: &Path) -> Result<String, String> {
    let connection = open_connection(path).map_err(|error| error.to_string())?;

    // Clear all existing module data first (child tables before parents).
    connection.execute_batch("PRAGMA foreign_keys = OFF;").map_err(|error| error.to_string())?;
    connection.execute_batch(
        "
        DELETE FROM sale_payments;
        DELETE FROM sales_returns;
        DELETE FROM customer_credits;
        DELETE FROM sale_items;
        DELETE FROM sales;
        DELETE FROM order_items;
        DELETE FROM orders;
        DELETE FROM gate_passes;
        DELETE FROM production_resources;
        DELETE FROM production_batches;
        DELETE FROM stock_movements;
        DELETE FROM inventory;
        DELETE FROM attendance;
        DELETE FROM wages;
        DELETE FROM payments;
        DELETE FROM cashbook;
        DELETE FROM expenses;
        DELETE FROM purchase_items;
        DELETE FROM purchases;
        DELETE FROM coal_fuel;
        DELETE FROM transport;
        DELETE FROM invoice_items;
        DELETE FROM invoices;
        DELETE FROM suppliers;
        DELETE FROM workers;
        DELETE FROM customers;
        DELETE FROM audit_logs;
        DELETE FROM sqlite_sequence;
        ",
    ).map_err(|error| error.to_string())?;
    connection.execute_batch("PRAGMA foreign_keys = ON;").map_err(|error| error.to_string())?;

    // Ensure brick grades exist
    let grade_names = ["First Class", "Second Class", "Third Class", "Seconds"];
    for (i, name) in grade_names.iter().enumerate() {
        connection.execute(
            "INSERT OR IGNORE INTO brick_grades (name,description,selling_price,purchase_rate,is_active,is_default)
             VALUES (?1,?2,?3,?4,1,?5)",
            rusqlite::params![
                name,
                format!("{} bricks", name),
                12.5 + (i as f64 * 2.0),
                8.0 + (i as f64 * 1.5),
                if i == 0 { 1 } else { 0 }
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed customers (50)
    let customer_names = [
        "Ahmed Khan", "Bilal Ahmed", "Usman Malik", "Hassan Ali", "Imran Sheikh",
        "Tariq Mehmood", "Rashid Minhas", "Sajid Nawaz", "Kamran Akhtar", "Naveed Iqbal",
        "Asif Raza", "Faisal Bhatti", "Waqas Ali", "Shahid Afridi", "Yasir Shah",
        "Adnan Sami", "Zohaib Malik", "Mohsin Khan", "Adeel Hussain", "Salman Butt",
        "Junaid Khan", "Rizwan Chohan", "Danish Ali", "Shoaib Akhtar", "Kamran Ali",
        "Shoaib Malik", "Asad Ullah", "Noman Ejaz", "Waseem Akram", "Shoaib Akram",
        "Misbah-ul-Haq", "Shane Watson", "Kumar Sangakkara", "Mahela Jayawardene",
        "Sanath Jayasuriya", "Arjuna Ranatunga", "Tillakaratne Dilshan", "Angelo Mathews",
        "Lasith Malinga", "Muttiah Muralitharan", "Chaminda Vaas", "Dulip Mendis",
        "Rohit Sharma", "Virat Kohli", "MS Dhoni", "Suresh Raina", "Yuvraj Singh",
        "Gautam Gambhir", "Rahul Dravid", "Sachin Tendulkar", "VVS Laxman", "Harbhajan Singh",
    ];
    let customer_names = &customer_names[..50];
    let cities = ["Lahore", "Faisalabad", "Multan", "Gujranwala", "Rawalpindi", "Sialkot", "Kasur", "Sheikhupura"];
    for (i, name) in customer_names.iter().enumerate() {
        let city = cities[i % cities.len()];
        let credit_limit = 50000.0 + (i as f64 * 10000.0);
        let status = if i % 10 == 9 { "inactive" } else { "active" };
        connection.execute(
            "INSERT INTO customers (customer_code,name,phone,email,address,city,credit_limit,status)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                format!("CUST-{:05}", i + 1),
                name,
                format!("03{:09}", 100000000 + i * 137),
                format!("{}@example.com", name.to_lowercase().replace(' ', ".")),
                format!("House {}, Street {}", i + 1, (i % 20) + 1),
                city,
                credit_limit,
                status
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed suppliers (20)
    let supplier_names = [
        "Coal Suppliers Ltd", "Fuel World", "Transport Services", "Raw Material Co",
        "Building Supplies", "Construction Materials", "Industrial Goods", "Wholesale Traders",
        "City Suppliers", "Metro Distributors", "National Traders", "Punjab Suppliers",
        "Sindh Traders", "KPK Suppliers", "Balochistan Co", "Azad Kashmir Traders",
        "Gilgit Suppliers", "Islamabad Distributors", "Rawalpindi Traders", "Faisalabad Suppliers",
    ];
    for (i, name) in supplier_names.iter().enumerate() {
        connection.execute(
            "INSERT INTO suppliers (supplier_code,name,phone,email,address,city,credit_limit,status)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                format!("SUP-{:05}", i + 1),
                name,
                format!("04{:09}", 200000000 + i * 149),
                format!("{}@supplier.com", name.to_lowercase().replace(' ', ".").replace(',', "")),
                format!("Industrial Area {}, Block {}", i + 1, (i % 10) + 1),
                cities[i % cities.len()],
                100000.0 + (i as f64 * 25000.0),
                if i % 8 == 7 { "inactive" } else { "active" }
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed workers (30)
    let worker_names = [
        "Muhammad Ali", "Hassan Raza", "Usman Tariq", "Bilal Ahmed", "Saifullah Khan",
        "Imran Khan", "Shahid Afridi", "Shoaib Akhtar", "Kamran Akmal", "Adnan Akmal",
        "Misbah-ul-Haq", "Yasir Hameed", "Abdul Razzaq", "Waqar Younis", "Wasim Akram",
        "Javed Miandad", "Inzamam-ul-Haq", "Salim Malik", "Mushtaq Ahmed", "Ijaz Ahmed",
        "Aaqib Javed", "Mohammad Amir", "Mohammad Hafeez", "Sarfaraz Ahmed", "Shoaib Malik",
        "Asad Shafiq", "Haroon Rasheed", "Imad Wasim", "Rashid Khan", "Fawad Alam",
    ];
    let work_categories = ["kiln_operator", "molder", "loader", "stacker", "helper", "supervisor", "quality_check", "maintenance"];
    let labour_groups = ["kiln_team", "molding_team", "stacking_team", "loading_team", "general"];
    for (i, name) in worker_names.iter().enumerate() {
        connection.execute(
            "INSERT INTO workers (worker_code,name,phone,labour_group,work_category,payment_method,wage_rate,status)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                format!("WRK-{:04}", i + 1),
                name,
                format!("05{:09}", 300000000 + i * 163),
                labour_groups[i % labour_groups.len()],
                work_categories[i % work_categories.len()],
                if i % 3 == 0 { "daily" } else { "monthly" },
                800.0 + (i as f64 * 50.0),
                if i % 10 == 9 { "inactive" } else { "active" }
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed production batches (50)
    let stages = ["pathai", "bhari", "nikasi", "completed"];
    let statuses = ["planned", "in_progress", "completed", "cancelled"];
    for i in 0..50 {
        let batch_num = format!("BATCH-{:04}", i + 1);
        let grade = grade_names[i % grade_names.len()];
        let planned = 50000 + (i as i64 * 1000);
        let produced = if i % 5 == 0 { planned / 2 } else { planned };
        let damaged = if i % 7 == 0 { produced / 20 } else { 0 };
        let stage = stages[i % stages.len()];
        let status = if i % 8 == 0 { "cancelled" } else if stage == "completed" { "completed" } else { statuses[i % statuses.len()] };
        let start_day = (i % 30) + 1;
        let start_date = format!("2026-{:02}-{:02}", (i % 11) + 1, start_day);
        let expected_date = if i % 3 == 0 { None } else { Some(format!("2026-{:02}-{:02}", (i % 11) + 2, (start_day + 7) % 28 + 1)) };
        let completed_date = if status == "completed" { Some(format!("2026-{:02}-{:02}", (i % 11) + 1, (start_day + 5) % 28 + 1)) } else { None };

        connection.execute(
            "INSERT INTO production_batches
                (batch_number,brick_grade,planned_quantity,produced_quantity,
                 damaged_quantity,stage,status,start_date,expected_date,
                 completed_date,notes)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
            rusqlite::params![
                batch_num, grade, planned, produced, damaged,
                stage, status, start_date, expected_date, completed_date,
                format!("Production batch {}", i + 1)
            ],
        ).map_err(|error| error.to_string())?;

        // Add resources for each batch
        let batch_id = connection.last_insert_rowid();
        let resources = [
            ("Coal", "tons", 50.0 + (i as f64 * 2.0), 4500.0),
            ("Wood", "kg", 200.0 + (i as f64 * 10.0), 25.0),
            ("Labor", "days", 30.0 + (i as f64), 800.0),
            ("Water", "liters", 5000.0 + (i as f64 * 100.0), 0.5),
        ];
        for (name, unit, qty, cost) in resources {
            connection.execute(
                "INSERT INTO production_resources (batch_id,resource_name,quantity,unit,unit_cost)
                 VALUES (?1,?2,?3,?4,?5)",
                rusqlite::params![batch_id, name, qty, unit, cost],
            ).map_err(|error| error.to_string())?;
        }
    }

    // Seed inventory (update existing grades with quantities)
    for (i, grade) in grade_names.iter().enumerate() {
        let qty = 50000 + (i as i64 * 25000);
        let reserved = qty / 10;
        let damaged = qty / 50;
        connection.execute(
            "INSERT INTO inventory (grade_name,quantity,reserved_quantity,damaged_quantity,reorder_level)
             VALUES (?1,?2,?3,?4,?5)
             ON CONFLICT(grade_name) DO UPDATE SET
                quantity=excluded.quantity,
                reserved_quantity=excluded.reserved_quantity,
                damaged_quantity=excluded.damaged_quantity,
                reorder_level=excluded.reorder_level,
                updated_at=CURRENT_TIMESTAMP",
            rusqlite::params![grade, qty, reserved, damaged, 10000],
        ).map_err(|error| error.to_string())?;
    }

    // Seed sales (50)
    let payment_statuses = ["unpaid", "partial", "paid"];
    let sale_statuses = ["confirmed", "draft", "completed", "cancelled"];
    for i in 0..50 {
        let customer_idx = i % customer_names.len();
        let customer_name = customer_names[customer_idx];
        let customer_id = (customer_idx + 1) as i64;
        let grade = grade_names[i % grade_names.len()];
        let quantity = 1000 + (i as i64 * 50);
        let unit_price = 10.0 + (i as f64 * 0.5);
        let subtotal = quantity as f64 * unit_price;
        let discount = if i % 4 == 0 { subtotal * 0.05 } else { 0.0 };
        let tax = subtotal * 0.02;
        let grand_total = ((subtotal - discount + tax) * 100.0).round() / 100.0;
        let paid = if i % 3 == 0 { grand_total } else if i % 3 == 1 { grand_total * 0.5 } else { 0.0 };
        let due = grand_total - paid;
        let status = sale_statuses[i % sale_statuses.len()];
        let payment_status = payment_statuses[i % payment_statuses.len()];
        let sale_date = format!("2026-{:02}-{:02}", (i % 11) + 1, (i % 28) + 1);
        let year = &sale_date[..4];
        let seq = i + 1;
        let invoice_number = format!("INV-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO sales
                (invoice_number,customer_id,customer_name,customer_phone,subtotal,
                 discount,tax,grand_total,paid_amount,due_amount,status,
                 payment_status,sale_date,notes)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14)",
            rusqlite::params![
                invoice_number, customer_id, customer_name,
                format!("03{:09}", 100000000 + customer_idx * 137),
                subtotal, discount, tax, grand_total, paid, due,
                status, payment_status, sale_date,
                format!("Sale order {}", i + 1)
            ],
        ).map_err(|error| error.to_string())?;

        let sale_id = connection.last_insert_rowid();
        connection.execute(
            "INSERT INTO sale_items (sale_id,brick_grade,quantity,unit_price,line_total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![sale_id, grade, quantity, unit_price, subtotal],
        ).map_err(|error| error.to_string())?;

        // Update inventory
        connection.execute(
            "UPDATE inventory SET quantity=quantity-?1,updated_at=CURRENT_TIMESTAMP
             WHERE grade_name=?2 COLLATE NOCASE",
            rusqlite::params![quantity, grade],
        ).map_err(|error| error.to_string())?;

        // Stock movement
        connection.execute(
            "INSERT INTO stock_movements (grade_name,movement_type,quantity,reference,notes,created_by)
             VALUES (?1,'out',?2,?3,'Customer sale','admin')",
            rusqlite::params![grade, quantity, invoice_number],
        ).map_err(|error| error.to_string())?;
    }

    // Seed orders (50)
    let order_statuses = ["draft", "pending", "confirmed", "processing", "completed", "cancelled"];
    for i in 0..50 {
        let customer_idx = (i * 7) % customer_names.len();
        let customer_name = customer_names[customer_idx];
        let customer_id = (customer_idx + 1) as i64;
        let grade = grade_names[i % grade_names.len()];
        let quantity = 2000 + (i as i64 * 100);
        let unit_price = 9.0 + (i as f64 * 0.3);
        let subtotal = quantity as f64 * unit_price;
        let discount = if i % 5 == 0 { subtotal * 0.03 } else { 0.0 };
        let tax = subtotal * 0.02;
        let total = ((subtotal - discount + tax) * 100.0).round() / 100.0;
        let paid = if i % 4 == 0 { total } else if i % 4 == 1 { total * 0.3 } else { 0.0 };
        let status = order_statuses[i % order_statuses.len()];
        let order_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 3) % 28) + 1);
        let delivery_date = if i % 3 == 0 { None } else { Some(format!("2026-{:02}-{:02}", (i % 11) + 2, ((i * 3 + 5) % 28) + 1)) };
        let year = &order_date[..4];
        let seq = i + 1;
        let order_number = format!("ORD-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO orders
                (order_number,customer_id,customer_name,order_date,delivery_date,
                 status,subtotal,discount,tax,total,paid_amount,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)",
            rusqlite::params![
                order_number, customer_id, customer_name, order_date,
                delivery_date, status, subtotal, discount, tax, total,
                paid, format!("Order {}", i + 1), "admin"
            ],
        ).map_err(|error| error.to_string())?;

        let order_id = connection.last_insert_rowid();
        connection.execute(
            "INSERT INTO order_items (order_id,brick_grade,quantity,unit_price,total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![order_id, grade, quantity, unit_price, subtotal],
        ).map_err(|error| error.to_string())?;
    }

    // Seed gate passes (50)
    let gp_statuses = ["prepared", "approved", "dispatched", "delivered", "cancelled"];
    let vehicles = ["LEA-1234", "LEC-5678", "LEJ-9012", "LEK-3456", "LEL-7890", "LEM-2345", "LEN-6789", "LEO-0123"];
    let drivers = ["Ahmed Raza", "Bilal Khan", "Usman Ali", "Hassan Malik", "Imran Sheikh",
        "Tariq Mehmood", "Rashid Minhas", "Sajid Nawaz", "Kamran Akhtar", "Naveed Iqbal"];
    for i in 0..50 {
        let customer_idx = (i * 11) % customer_names.len();
        let customer_name = customer_names[customer_idx];
        let customer_id = (customer_idx + 1) as i64;
        let grade = grade_names[i % grade_names.len()];
        let quantity = 5000 + (i as i64 * 200);
        let dispatch_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 5) % 28) + 1);
        let year = &dispatch_date[..4];
        let seq = i + 1;
        let pass_number = format!("GP-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO gate_passes
                (pass_number,order_id,customer_id,customer_name,dispatch_date,
                 vehicle_number,driver_name,driver_phone,brick_grade,quantity,
                 unit,destination,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)",
            rusqlite::params![
                pass_number,
                if i % 2 == 0 { Some((i / 2 + 1) as i64) } else { None },
                customer_id, customer_name, dispatch_date,
                vehicles[i % vehicles.len()],
                drivers[i % drivers.len()],
                format!("03{:09}", 400000000 + i * 173),
                grade, quantity, "bricks",
                cities[i % cities.len()],
                gp_statuses[i % gp_statuses.len()],
                format!("Gate pass {}", i + 1),
                "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed attendance (30 workers × 20 days = 600 records)
    let attendance_statuses = ["present", "present", "present", "present", "absent", "half_day", "leave", "weekly_off", "late", "early_departure"];
    for day in 1..=20 {
        let date = format!("2026-{:02}-{:02}", (day % 11) + 1, (day % 28) + 1);
        for worker_idx in 0..30 {
            let worker_id = (worker_idx + 1) as i64;
            let status = attendance_statuses[(worker_idx + day) % attendance_statuses.len()];
            let check_in = if status == "absent" || status == "leave" || status == "weekly_off" {
                None
            } else {
                Some(format!("{:02}:{:02}", 7 + (worker_idx % 3), (worker_idx * 7) % 60))
            };
            let check_out = if status == "absent" || status == "leave" || status == "weekly_off" {
                None
            } else {
                Some(format!("{:02}:{:02}", 16 + (worker_idx % 2), (worker_idx * 11) % 60))
            };
            let payable_hours = match status {
                "present" => 8.0,
                "half_day" => 4.0,
                "late" | "early_departure" => 7.0,
                _ => 0.0,
            };
            connection.execute(
                "INSERT INTO attendance
                    (worker_id,attendance_date,status,check_in,check_out,
                     break_minutes,payable_hours,notes,recorded_by)
                 VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
                rusqlite::params![
                    worker_id, date, status, check_in, check_out,
                    60, payable_hours,
                    format!("Day {} attendance", day),
                    "admin"
                ],
            ).map_err(|error| error.to_string())?;
        }
    }

    // Seed wages (50)
    for i in 0..50 {
        let worker_idx = i % 30;
        let worker_id = (worker_idx + 1) as i64;
        let worker_name = worker_names[worker_idx];
        let daily_wage = 800.0 + (worker_idx as f64 * 50.0);
        let total_days = (20 + (i % 10)) as i64;
        let total_amount = daily_wage * total_days as f64;
        let advances = if i % 4 == 0 { total_amount * 0.1 } else { 0.0 };
        let deductions = if i % 5 == 0 { total_amount * 0.05 } else { 0.0 };
        let net_amount = ((total_amount - advances - deductions).max(0.0) * 100.0).round() / 100.0;
        let status = if i % 3 == 0 { "paid" } else { "pending" };
        let payment_date = if status == "paid" { Some(format!("2026-{:02}-{:02}", (i % 11) + 1, (i % 28) + 1)) } else { None };
        let period_start = format!("2026-{:02}-01", (i % 11) + 1);
        let period_end = format!("2026-{:02}-28", (i % 11) + 1);
        let year = &period_start[..4];
        let seq = i + 1;
        let wage_number = format!("WAGE-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO wages
                (wage_number,worker_id,worker_name,period_start,period_end,
                 total_days,daily_wage,total_amount,advances,deductions,
                 net_amount,status,payment_date,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)",
            rusqlite::params![
                wage_number, worker_id, worker_name, period_start, period_end,
                total_days, daily_wage, total_amount, advances, deductions,
                net_amount, status, payment_date,
                format!("Wage period {}", i + 1), "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed expenses (50)
    let expense_categories = ["coal", "wood", "labor", "transport", "maintenance", "utilities", "miscellaneous", "fuel", "rent", "insurance"];
    let expense_statuses = ["pending", "approved", "rejected"];
    for i in 0..50 {
        let category = expense_categories[i % expense_categories.len()];
        let amount = 5000.0 + (i as f64 * 500.0);
        let expense_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 7) % 28) + 1);
        let year = &expense_date[..4];
        let seq = i + 1;
        let expense_number = format!("EXP-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO expenses
                (expense_number,category,amount,expense_date,description,
                 payment_method,status,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                expense_number, category, amount, expense_date,
                format!("{} expense {}", category, i + 1),
                if i % 3 == 0 { "bank_transfer" } else { "cash" },
                expense_statuses[i % expense_statuses.len()],
                "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed purchases (50)
    let purchase_statuses = ["draft", "completed", "cancelled"];
    for i in 0..50 {
        let supplier_idx = i % supplier_names.len();
        let supplier_name = supplier_names[supplier_idx];
        let supplier_id = (supplier_idx + 1) as i64;
        let purchase_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 3) % 28) + 1);
        let year = &purchase_date[..4];
        let seq = i + 1;
        let purchase_number = format!("PUR-{}-{:05}", year, seq);

        // Create purchase with items
        let item_count = 1 + (i % 3);
        let mut subtotal = 0.0;
        let mut items = Vec::new();
        for j in 0..item_count {
            let item_name = if j == 0 { "Coal" } else if j == 1 { "Wood" } else { "Equipment" };
            let qty = 10.0 + (i as f64 * 0.5) + (j as f64 * 5.0);
            let price = 1000.0 + (i as f64 * 50.0) + (j as f64 * 200.0);
            let total = qty * price;
            subtotal += total;
            items.push((item_name, qty, "tons", price, total));
        }
        let tax = subtotal * 0.05;
        let total = ((subtotal + tax) * 100.0).round() / 100.0;
        let paid = if i % 3 == 0 { total } else if i % 3 == 1 { total * 0.5 } else { 0.0 };
        let payment_status = if paid == total { "paid" } else if paid > 0.0 { "partial" } else { "unpaid" };
        let status = purchase_statuses[i % purchase_statuses.len()];

        connection.execute(
            "INSERT INTO purchases
                (purchase_number,supplier_id,supplier_name,purchase_date,
                 subtotal,tax,total,paid_amount,payment_status,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)",
            rusqlite::params![
                purchase_number, supplier_id, supplier_name, purchase_date,
                subtotal, tax, total, paid, payment_status, status,
                format!("Purchase {}", i + 1), "admin"
            ],
        ).map_err(|error| error.to_string())?;

        let purchase_id = connection.last_insert_rowid();
        for (name, qty, unit, price, item_total) in items {
            connection.execute(
                "INSERT INTO purchase_items (purchase_id,item_name,quantity,unit,unit_price,total)
                 VALUES (?1,?2,?3,?4,?5,?6)",
                rusqlite::params![purchase_id, name, qty, unit, price, item_total],
            ).map_err(|error| error.to_string())?;
        }
    }

    // Seed coal & fuel (50)
    let fuel_types = ["coal", "wood", "diesel", "petrol", "natural_gas", "charcoal"];
    let fuel_statuses = ["in_stock", "low_stock", "out_of_stock"];
    for i in 0..50 {
        let fuel_type = fuel_types[i % fuel_types.len()];
        let quantity = 100.0 + (i as f64 * 10.0);
        let unit = if fuel_type == "coal" || fuel_type == "wood" { "tons" } else { "liters" };
        let purchase_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 9) % 28) + 1);
        let supplier_idx = (i * 3) % supplier_names.len();
        let supplier_name = supplier_names[supplier_idx];
        let cost = quantity * (500.0 + (i as f64 * 25.0));
        let status = fuel_statuses[i % fuel_statuses.len()];

        connection.execute(
            "INSERT INTO coal_fuel
                (fuel_type,quantity,unit,purchase_date,supplier,cost,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
            rusqlite::params![
                fuel_type, quantity, unit, purchase_date, supplier_name,
                cost, status, format!("Fuel {}", i + 1), "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed transport (50)
    let transport_statuses = ["pending", "in_progress", "completed", "cancelled"];
    for i in 0..50 {
        let trip_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 11) % 28) + 1);
        let year = &trip_date[..4];
        let seq = i + 1;
        let trip_number = format!("TRP-{}-{:05}", year, seq);
        let vehicle_idx = i % vehicles.len();
        let driver_idx = (i * 3) % drivers.len();
        let bricks = 5000 + (i as i64 * 300);
        let cost = 15000.0 + (i as f64 * 1000.0);
        let status = transport_statuses[i % transport_statuses.len()];

        connection.execute(
            "INSERT INTO transport
                (trip_number,vehicle_number,driver_name,driver_phone,trip_date,
                 route,bricks_transported,cost,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
            rusqlite::params![
                trip_number, vehicles[vehicle_idx], drivers[driver_idx],
                format!("03{:09}", 500000000 + i * 191),
                trip_date, cities[i % cities.len()], bricks, cost, status,
                format!("Transport {}", i + 1), "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed invoices (50)
    let invoice_statuses = ["unpaid", "partial", "paid", "overdue"];
    for i in 0..50 {
        let customer_idx = (i * 13) % customer_names.len();
        let customer_name = customer_names[customer_idx];
        let customer_id = (customer_idx + 1) as i64;
        let grade = grade_names[i % grade_names.len()];
        let quantity = 500 + (i as i64 * 25);
        let unit_price = 11.0 + (i as f64 * 0.4);
        let amount = quantity as f64 * unit_price;
        let paid = if i % 4 == 0 { amount } else if i % 4 == 1 { amount * 0.5 } else { 0.0 };
        let balance = ((amount - paid).max(0.0) * 100.0).round() / 100.0;
        let invoice_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 13) % 28) + 1);
        let due_date = format!("2026-{:02}-{:02}", (i % 11) + 2, ((i * 13 + 15) % 28) + 1);
        let status = invoice_statuses[i % invoice_statuses.len()];
        let year = &invoice_date[..4];
        let seq = i + 1;
        let invoice_number = format!("INV-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO invoices
                (invoice_number,customer_id,customer_name,invoice_date,due_date,
                 amount,paid_amount,balance,status,notes,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
            rusqlite::params![
                invoice_number, customer_id, customer_name, invoice_date, due_date,
                amount, paid, balance, status,
                format!("Invoice {}", i + 1), "admin"
            ],
        ).map_err(|error| error.to_string())?;

        let invoice_id = connection.last_insert_rowid();
        connection.execute(
            "INSERT INTO invoice_items (invoice_id,brick_grade,quantity,unit_price,total)
             VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![invoice_id, grade, quantity, unit_price, amount],
        ).map_err(|error| error.to_string())?;
    }

    // Seed payments (50)
    let payment_types = ["receipt", "payment"];
    let party_types = ["customer", "supplier"];
    let payment_methods = ["cash", "bank_transfer", "cheque", "online"];
    for i in 0..50 {
        let payment_type = payment_types[i % payment_types.len()];
        let party_type = party_types[i % party_types.len()];
        let party_idx = (i * 5) % if party_type == "customer" { customer_names.len() } else { supplier_names.len() };
        let party_name = if party_type == "customer" { customer_names[party_idx] } else { supplier_names[party_idx] };
        let party_id = (party_idx + 1) as i64;
        let payment_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 17) % 28) + 1);
        let amount = 10000.0 + (i as f64 * 2000.0);
        let method = payment_methods[i % payment_methods.len()];
        let status = if i % 5 == 0 { "pending" } else { "completed" };
        let year = &payment_date[..4];
        let seq = i + 1;
        let payment_number = format!("PAY-{}-{:05}", year, seq);

        connection.execute(
            "INSERT INTO payments
                (payment_number,payment_type,party_type,party_id,party_name,
                 payment_date,amount,payment_method,reference,notes,status,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)",
            rusqlite::params![
                payment_number, payment_type, party_type, party_id, party_name,
                payment_date, amount, method,
                format!("REF-{}", i + 1),
                format!("Payment {}", i + 1), status, "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed cashbook entries (50)
    let mut balance = 0.0;
    for i in 0..50 {
        let is_income = i % 2 == 0;
        let amount = 5000.0 + (i as f64 * 1500.0);
        let entry_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 19) % 28) + 1);
        let description = if is_income {
            format!("Sale receipt {}", i + 1)
        } else {
            format!("Expense payment {}", i + 1)
        };
        balance += if is_income { amount } else { -amount };

        connection.execute(
            "INSERT INTO cashbook
                (entry_date,description,type,amount,balance,reference_type,reference_id,created_by)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                entry_date, description,
                if is_income { "income" } else { "expense" },
                amount, balance,
                if is_income { "sale" } else { "expense" },
                (i + 1) as i64,
                "admin"
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Seed sale returns (20)
    for i in 0..20 {
        let sale_idx = i % 50;
        let sale: Option<(i64, String, String)> = connection.query_row(
            "SELECT id,invoice_number,customer_name FROM sales WHERE id=?1",
            [(sale_idx + 1) as i64],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)),
        ).optional().map_err(|error| error.to_string())?;

        if let Some((sale_id, invoice_number, customer_name)) = sale {
            let grade = grade_names[i % grade_names.len()];
            let quantity = 10 + (i as i64 * 5);
            let return_date = format!("2026-{:02}-{:02}", (i % 11) + 1, ((i * 23) % 28) + 1);
            let credit_amount = quantity as f64 * 10.0;

            connection.execute(
                "INSERT INTO sales_returns
                    (sale_id,invoice_number,customer_name,brick_grade,quantity,
                     reason,status,return_date,credit_amount)
                 VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
                rusqlite::params![
                    sale_id, invoice_number, customer_name, grade, quantity,
                    format!("Return reason {}", i + 1),
                    if i % 4 == 0 { "pending" } else { "approved" },
                    return_date, credit_amount
                ],
            ).map_err(|error| error.to_string())?;

            // Return stock
            connection.execute(
                "UPDATE inventory SET quantity=quantity+?1,updated_at=CURRENT_TIMESTAMP
                 WHERE grade_name=?2 COLLATE NOCASE",
                rusqlite::params![quantity, grade],
            ).map_err(|error| error.to_string())?;
        }
    }

    // Seed audit logs (50)
    let audit_actions = ["create", "update", "delete", "view", "login", "logout"];
    let audit_modules = ["orders", "sales", "inventory", "customers", "production", "payments", "gate_pass", "wages", "expenses"];
    for i in 0..50 {
        let action = audit_actions[i % audit_actions.len()];
        let module = audit_modules[i % audit_modules.len()];
        let created_at = format!("2026-{:02}-{:02} {:02}:{:02}:{:02}",
            (i % 11) + 1, ((i * 29) % 28) + 1,
            i % 24, (i * 7) % 60, (i * 13) % 60);

        connection.execute(
            "INSERT INTO audit_logs
                (user_id,username,action,module,record_id,old_values,new_values,created_at)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                1, "admin", action, module,
                Some((i + 1) as i64),
                if i % 2 == 0 { Some("{\"old\":\"value\"}") } else { None },
                if i % 2 == 0 { Some("{\"new\":\"value\"}") } else { None },
                created_at
            ],
        ).map_err(|error| error.to_string())?;
    }

    // Mark as seeded
    connection.execute(
        "INSERT OR IGNORE INTO app_settings (setting_key,setting_value) VALUES ('seeded','true')",
        [],
    ).map_err(|error| error.to_string())?;

    Ok("Seed data created successfully: 50 customers, 20 suppliers, 30 workers, 50 production batches, 50 sales, 50 orders, 50 gate passes, ~600 attendance records, 50 wages, 50 expenses, 50 purchases, 50 fuel records, 50 transport trips, 50 invoices, 50 payments, 50 cashbook entries, 20 returns, 50 audit logs.".to_string())
}

// ─── Backup, Maintenance & Diagnostics ─────────────────────────────────────

fn utc_now() -> String {
    Connection::open_in_memory()
        .and_then(|c| c.query_row("SELECT datetime('now')", [], |r| r.get(0)))
        .unwrap_or_else(|_| "unknown".to_string())
}

fn file_size(path: &Path) -> u64 {
    std::fs::metadata(path).map(|m| m.len()).unwrap_or(0)
}

fn timestamp_slug() -> String {
    utc_now().replace([':', ' ', '-'], "")
}

/// Rotating append-only log at <app_data>/logs/bhatta.log (1 MB rotation).
pub fn append_log_line(log_path: &Path, message: &str) {
    if let Some(parent) = log_path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    if file_size(log_path) > 1024 * 1024 {
        let _ = std::fs::rename(log_path, log_path.with_extension("log.1"));
    }
    if let Ok(mut file) = std::fs::OpenOptions::new().create(true).append(true).open(log_path) {
        use std::io::Write;
        let _ = writeln!(file, "[{}] {}", utc_now(), sanitize_log_line(message));
    }
}

/// Strip anything that looks like a secret from a log line.
fn sanitize_log_line(line: &str) -> String {
    let lower = line.to_lowercase();
    let mut cut = line.len();
    for keyword in ["password", "passwd", "token", "secret", "pin", "license_key", "activation"] {
        if let Some(idx) = lower.find(keyword) {
            cut = cut.min(idx);
        }
    }
    let mut out = line[..cut].trim_end().to_string();
    if cut < line.len() {
        out.push_str(" [REDACTED]");
    }
    out.chars().take(500).collect()
}

pub fn log_path_for_db(db_path: &Path) -> PathBuf {
    db_path
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .join("logs")
        .join("bhatta.log")
}

// ─── Backup (VACUUM INTO snapshot) ─────────────────────────────────────────

#[derive(Serialize)]
pub struct BackupInfo {
    pub name: String,
    pub path: String,
    pub size_bytes: u64,
    pub created_at: String,
}

pub fn create_backup(path: &Path) -> Result<BackupInfo, String> {
    let app_data = path.parent().ok_or("Invalid database path")?;
    let backup_dir = app_data.join("backups");
    std::fs::create_dir_all(&backup_dir).map_err(|e| e.to_string())?;

    // Checkpoint WAL so the snapshot is clean and the -wal file resets.
    {
        let conn = open_connection(path).map_err(|e| e.to_string())?;
        conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);")
            .map_err(|e| e.to_string())?;
    }

    let stamp = timestamp_slug();
    let backup_path = backup_dir.join(format!("bhatta_{}.db", stamp));
    let escaped = backup_path.to_string_lossy().replace('\'', "''");

    let conn = open_connection(path).map_err(|e| e.to_string())?;
    conn.execute(&format!("VACUUM INTO '{}'", escaped), [])
        .map_err(|e| format!("Backup failed: {}", e))?;
    drop(conn);

    let name = backup_path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    Ok(BackupInfo {
        name,
        path: backup_path.to_string_lossy().to_string(),
        size_bytes: file_size(&backup_path),
        created_at: utc_now(),
    })
}

pub fn list_backups(db_path: &Path) -> Result<Vec<BackupInfo>, String> {
    let backup_dir = db_path
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .join("backups");
    let mut backups = Vec::new();
    if let Ok(entries) = std::fs::read_dir(&backup_dir) {
        for entry in entries.flatten() {
            let p = entry.path();
            if p.extension().map(|e| e == "db").unwrap_or(false) {
                let name = p
                    .file_name()
                    .map(|n| n.to_string_lossy().to_string())
                    .unwrap_or_default();
                let created = entry
                    .metadata()
                    .ok()
                    .and_then(|m| m.created().ok())
                    .map(|t| {
                        let secs = t
                            .duration_since(std::time::UNIX_EPOCH)
                            .map(|d| d.as_secs())
                            .unwrap_or(0);
                        format!("unix:{}", secs)
                    })
                    .unwrap_or_default();
                backups.push(BackupInfo {
                    name: name.clone(),
                    path: p.to_string_lossy().to_string(),
                    size_bytes: file_size(&p),
                    created_at: created,
                });
            }
        }
    }
    backups.sort_by(|a, b| b.name.cmp(&a.name));
    Ok(backups)
}

/// Restore a backup file over the live database. App should be restarted
/// afterwards so all connections pick up the restored file.
pub fn restore_backup(db_path: &Path, backup_name: &str) -> Result<String, String> {
    // Only allow simple file names inside the backups directory.
    if backup_name.contains(['/', '\\']) || backup_name.contains("..") || !backup_name.ends_with(".db") {
        return Err("Invalid backup file name.".to_string());
    }
    let backup_path = db_path
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .join("backups")
        .join(backup_name);
    if !backup_path.exists() {
        return Err("Backup file not found.".to_string());
    }

    // Checkpoint + drop any WAL sidecars before overwriting.
    if let Ok(conn) = open_connection(db_path) {
        let _ = conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);");
    }
    let _ = std::fs::remove_file(db_path.with_extension("db-wal"));
    let _ = std::fs::remove_file(db_path.with_extension("db-shm"));

    std::fs::copy(&backup_path, db_path).map_err(|e| format!("Restore failed: {}", e))?;
    Ok(format!(
        "Backup '{}' restored. Please restart the application.",
        backup_name
    ))
}

// ─── Maintenance ───────────────────────────────────────────────────────────

pub fn database_maintenance(path: &Path) -> Result<(), String> {
    let conn = open_connection(path).map_err(|e| e.to_string())?;
    conn.execute_batch(
        "
        PRAGMA wal_checkpoint(TRUNCATE);
        PRAGMA optimize;
        ",
    )
    .map_err(|e| e.to_string())
}

// ─── Diagnostics ───────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct SystemInfo {
    pub app_version: String,
    pub os: String,
    pub arch: String,
    pub db_path: String,
    pub db_size_bytes: u64,
    pub wal_size_bytes: u64,
    pub schema_version: i64,
    pub generated_at: String,
}

pub fn get_system_info(path: &Path) -> Result<SystemInfo, String> {
    let schema_version: i64 = open_connection(path)
        .map_err(|e| e.to_string())?
        .query_row(
            "SELECT COALESCE(MAX(version),0) FROM schema_migrations",
            [],
            |r| r.get(0),
        )
        .unwrap_or(0);
    Ok(SystemInfo {
        app_version: env!("CARGO_PKG_VERSION").to_string(),
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        db_path: path.to_string_lossy().to_string(),
        db_size_bytes: file_size(path),
        wal_size_bytes: file_size(&path.with_extension("db-wal")),
        schema_version,
        generated_at: utc_now(),
    })
}

pub fn get_recent_errors(db_path: &Path, max_lines: usize) -> Result<Vec<String>, String> {
    let log_path = log_path_for_db(db_path);
    let content = std::fs::read_to_string(&log_path).unwrap_or_default();
    // Take the last N lines, then restore chronological order.
    let out: Vec<String> = content
        .lines()
        .rev()
        .take(max_lines)
        .map(|l| l.to_string())
        .collect::<Vec<_>>()
        .into_iter()
        .rev()
        .collect();
    Ok(out)
}

pub fn log_frontend_error(db_path: &Path, message: &str) -> Result<(), String> {
    let log_path = log_path_for_db(db_path);
    append_log_line(&log_path, &format!("[frontend] {}", message));
    Ok(())
}

/// Writes a diagnostic bundle text file and returns its path.
pub fn export_diagnostic_file(db_path: &Path) -> Result<String, String> {
    let app_data = db_path.parent().ok_or("Invalid database path")?;
    let diag_dir = app_data.join("diagnostics");
    std::fs::create_dir_all(&diag_dir).map_err(|e| e.to_string())?;

    let info = get_system_info(db_path)?;
    let errors = get_recent_errors(db_path, 300)?;
    let bundle = format!(
        "BHATTA KHATA PRO — DIAGNOSTIC BUNDLE\n\
         Generated: {}\n\
         App version: {}\n\
         OS: {} ({})\n\
         Database size: {} bytes (WAL {} bytes)\n\
         Schema version: {}\n\n\
         --- RECENT LOG (may contain user data; review before sharing) ---\n{}\n",
        info.generated_at,
        info.app_version,
        info.os,
        info.arch,
        info.db_size_bytes,
        info.wal_size_bytes,
        info.schema_version,
        errors.join("\n"),
    );

    let file_path = diag_dir.join(format!("bhatta_diagnostics_{}.txt", timestamp_slug()));
    std::fs::write(&file_path, bundle).map_err(|e| e.to_string())?;
    Ok(file_path.to_string_lossy().to_string())
}

// ─── Hot/Cold Archiving ────────────────────────────────────────────────────

/// Moves finalized historical records older than `cutoff_date` (YYYY-MM-DD)
/// into <app_data>/archives/archive_<year>.db inside one transaction.
/// Master data (customers, suppliers, workers, grades, settings) always stays.
pub fn archive_old_records(db_path: &Path, cutoff_date: &str) -> Result<String, String> {
    if cutoff_date.len() != 10 || cutoff_date.matches('-').count() != 2 {
        return Err("Cutoff date must be YYYY-MM-DD.".to_string());
    }
    let app_data = db_path.parent().ok_or("Invalid database path")?;
    let archive_dir = app_data.join("archives");
    std::fs::create_dir_all(&archive_dir).map_err(|e| e.to_string())?;
    let year = &cutoff_date[..4];
    let archive_path = archive_dir.join(format!("archive_{}.db", year));
    let archive_literal = archive_path.to_string_lossy().replace('\'', "''");

    let mut conn = open_connection(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        &format!("ATTACH DATABASE '{}' AS arch", archive_literal),
        [],
    )
    .map_err(|e| format!("Cannot open archive: {}", e))?;

    // Table sets: (archive table, source select, delete statement)
    // Each entry runs inside one transaction; children deleted before parents.
    let result = (|| -> Result<String, String> {
        let tx = conn.transaction().map_err(|e| e.to_string())?;

        // Create archive tables as plain copies (no FK constraints needed for cold data).
        for table in [
            "sales", "sale_items", "sale_payments", "sales_returns", "customer_credits",
            "orders", "order_items", "gate_passes", "expenses", "attendance",
            "production_batches", "production_resources", "payments", "purchases",
            "purchase_items", "invoices", "invoice_items", "wages", "audit_logs",
        ] {
            tx.execute(
                &format!("CREATE TABLE IF NOT EXISTS arch.{} AS SELECT * FROM main.{} WHERE 0", table, table),
                [],
            )
            .map_err(|e| e.to_string())?;
        }

        let mut moved: Vec<String> = Vec::new();
        let mut move_rows = |tx: &rusqlite::Transaction<'_>,
                             _table: &str,
                             insert_sql: &str,
                             delete_sql: &str,
                             label: &str|
         -> Result<(), String> {
            let inserted = tx.execute(insert_sql, rusqlite::params![cutoff_date])
                .map_err(|e| e.to_string())?;
            if inserted > 0 {
                tx.execute(delete_sql, rusqlite::params![cutoff_date])
                    .map_err(|e| e.to_string())?;
                moved.push(format!("{}:{}", label, inserted));
            }
            Ok(())
        };

        // ── Sales (settled only: completed/cancelled with no due) ──
        let sale_filter = "sale_date < ?1 AND status IN ('completed','cancelled') AND due_amount <= 0";
        move_rows(&tx, "sale_items",
            &format!("INSERT INTO arch.sale_items SELECT i.* FROM main.sale_items i JOIN main.sales s ON s.id=i.sale_id WHERE {}", sale_filter),
            &format!("DELETE FROM main.sale_items WHERE sale_id IN (SELECT id FROM main.sales WHERE {})", sale_filter),
            "sale_items")?;
        move_rows(&tx, "sale_payments",
            &format!("INSERT INTO arch.sale_payments SELECT p.* FROM main.sale_payments p JOIN main.sales s ON s.id=p.sale_id WHERE {}", sale_filter),
            &format!("DELETE FROM main.sale_payments WHERE sale_id IN (SELECT id FROM main.sales WHERE {})", sale_filter),
            "sale_payments")?;
        move_rows(&tx, "sales_returns",
            &format!("INSERT INTO arch.sales_returns SELECT r.* FROM main.sales_returns r JOIN main.sales s ON s.id=r.sale_id WHERE {}", sale_filter),
            &format!("DELETE FROM main.sales_returns WHERE sale_id IN (SELECT id FROM main.sales WHERE {})", sale_filter),
            "sales_returns")?;
        move_rows(&tx, "customer_credits",
            &format!("INSERT INTO arch.customer_credits SELECT c.* FROM main.customer_credits c JOIN main.sales s ON s.id=c.sale_id WHERE {}", sale_filter),
            &format!("DELETE FROM main.customer_credits WHERE sale_id IN (SELECT id FROM main.sales WHERE {})", sale_filter),
            "customer_credits")?;
        move_rows(&tx, "sales",
            &format!("INSERT INTO arch.sales SELECT * FROM main.sales WHERE {}", sale_filter),
            &format!("DELETE FROM main.sales WHERE {}", sale_filter),
            "sales")?;

        // ── Orders (completed/cancelled) + items; detach gate pass links first ──
        let order_filter = "order_date < ?1 AND status IN ('completed','cancelled')";
        tx.execute(
            &format!("UPDATE main.gate_passes SET order_id=NULL WHERE order_id IN (SELECT id FROM main.orders WHERE {})", order_filter),
            rusqlite::params![cutoff_date],
        )
        .map_err(|e| e.to_string())?;
        move_rows(&tx, "order_items",
            &format!("INSERT INTO arch.order_items SELECT i.* FROM main.order_items i JOIN main.orders o ON o.id=i.order_id WHERE {}", order_filter),
            &format!("DELETE FROM main.order_items WHERE order_id IN (SELECT id FROM main.orders WHERE {})", order_filter),
            "order_items")?;
        move_rows(&tx, "orders",
            &format!("INSERT INTO arch.orders SELECT * FROM main.orders WHERE {}", order_filter),
            &format!("DELETE FROM main.orders WHERE {}", order_filter),
            "orders")?;

        // ── Gate passes (delivered/cancelled) ──
        move_rows(&tx, "gate_passes",
            "INSERT INTO arch.gate_passes SELECT * FROM main.gate_passes WHERE dispatch_date < ?1 AND status IN ('delivered','cancelled')",
            "DELETE FROM main.gate_passes WHERE dispatch_date < ?1 AND status IN ('delivered','cancelled')",
            "gate_passes")?;

        // ── Expenses (non-pending) ──
        move_rows(&tx, "expenses",
            "INSERT INTO arch.expenses SELECT * FROM main.expenses WHERE expense_date < ?1 AND status != 'pending'",
            "DELETE FROM main.expenses WHERE expense_date < ?1 AND status != 'pending'",
            "expenses")?;

        // ── Attendance (all history) ──
        move_rows(&tx, "attendance",
            "INSERT INTO arch.attendance SELECT * FROM main.attendance WHERE attendance_date < ?1",
            "DELETE FROM main.attendance WHERE attendance_date < ?1",
            "attendance")?;

        // ── Production batches (completed/cancelled) + resources ──
        let prod_filter = "status IN ('completed','cancelled') AND COALESCE(completed_date, start_date) < ?1";
        move_rows(&tx, "production_resources",
            &format!("INSERT INTO arch.production_resources SELECT r.* FROM main.production_resources r JOIN main.production_batches b ON b.id=r.batch_id WHERE {}", prod_filter),
            &format!("DELETE FROM main.production_resources WHERE batch_id IN (SELECT id FROM main.production_batches WHERE {})", prod_filter),
            "production_resources")?;
        move_rows(&tx, "production_batches",
            &format!("INSERT INTO arch.production_batches SELECT * FROM main.production_batches WHERE {}", prod_filter),
            &format!("DELETE FROM main.production_batches WHERE {}", prod_filter),
            "production_batches")?;

        // ── Payments (settled) ──
        move_rows(&tx, "payments",
            "INSERT INTO arch.payments SELECT * FROM main.payments WHERE payment_date < ?1 AND status IN ('completed','cancelled')",
            "DELETE FROM main.payments WHERE payment_date < ?1 AND status IN ('completed','cancelled')",
            "payments")?;

        // ── Purchases (completed/cancelled) + items ──
        let purch_filter = "purchase_date < ?1 AND status IN ('completed','cancelled')";
        move_rows(&tx, "purchase_items",
            &format!("INSERT INTO arch.purchase_items SELECT i.* FROM main.purchase_items i JOIN main.purchases p ON p.id=i.purchase_id WHERE {}", purch_filter),
            &format!("DELETE FROM main.purchase_items WHERE purchase_id IN (SELECT id FROM main.purchases WHERE {})", purch_filter),
            "purchase_items")?;
        move_rows(&tx, "purchases",
            &format!("INSERT INTO arch.purchases SELECT * FROM main.purchases WHERE {}", purch_filter),
            &format!("DELETE FROM main.purchases WHERE {}", purch_filter),
            "purchases")?;

        // ── Invoices (fully paid only) + items ──
        let inv_filter = "invoice_date < ?1 AND status = 'paid'";
        move_rows(&tx, "invoice_items",
            &format!("INSERT INTO arch.invoice_items SELECT i.* FROM main.invoice_items i JOIN main.invoices v ON v.id=i.invoice_id WHERE {}", inv_filter),
            &format!("DELETE FROM main.invoice_items WHERE invoice_id IN (SELECT id FROM main.invoices WHERE {})", inv_filter),
            "invoice_items")?;
        move_rows(&tx, "invoices",
            &format!("INSERT INTO arch.invoices SELECT * FROM main.invoices WHERE {}", inv_filter),
            &format!("DELETE FROM main.invoices WHERE {}", inv_filter),
            "invoices")?;

        // ── Wages (paid/cancelled, period ended before cutoff) ──
        move_rows(&tx, "wages",
            "INSERT INTO arch.wages SELECT * FROM main.wages WHERE period_end < ?1 AND status IN ('paid','cancelled')",
            "DELETE FROM main.wages WHERE period_end < ?1 AND status IN ('paid','cancelled')",
            "wages")?;

        // ── Audit logs (old history) ──
        move_rows(&tx, "audit_logs",
            "INSERT INTO arch.audit_logs SELECT * FROM main.audit_logs WHERE created_at < ?1",
            "DELETE FROM main.audit_logs WHERE created_at < ?1",
            "audit_logs")?;

        // ── Opening balances snapshot (customers' current outstanding) ──
        tx.execute(
            "CREATE TABLE IF NOT EXISTS arch.opening_balances AS
             SELECT 'customer' AS entity_type, c.id AS entity_id, c.name AS entity_name,
                    COALESCE((SELECT SUM(s.due_amount) FROM main.sales s
                              WHERE s.customer_id = c.id AND s.status != 'cancelled'), 0) AS balance,
                    datetime('now') AS snapshot_at
             FROM main.customers c",
            [],
        )
        .map_err(|e| e.to_string())?;

        tx.commit().map_err(|e| e.to_string())?;
        let _ = moved;
        Ok(format!(
            "Archive complete: moved records older than {} into archive_{}.db",
            cutoff_date, year
        ))
    })();

    let _ = conn.execute("DETACH DATABASE arch", []);
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    fn temp_database(name: &str) -> PathBuf {
        std::env::temp_dir().join(format!(
            "bhatta-khata-pro-test-{}-{}.db",
            name,
            std::process::id()
        ))
    }

    fn cleanup(path: &Path) {
        let _ = fs::remove_file(path);
        let _ = fs::remove_file(path.with_extension("db-wal"));
        let _ = fs::remove_file(path.with_extension("db-shm"));
    }

    fn stock_for(path: &Path, grade: &str) -> i64 {
        get_inventory(path)
            .expect("inventory should load")
            .into_iter()
            .find(|item| item.grade_name == grade)
            .expect("grade should exist in inventory")
            .quantity
    }

    #[test]
    fn initializes_schema_and_authenticates_admin() {
        let path = temp_database("auth");
        cleanup(&path);

        initialize(&path).expect("database should initialize");
        assert!(!admin_exists(&path).expect("admin check should run"));

        let profile = BusinessProfile {
            business_name: "Test Kiln".to_string(),
            owner_name: "Owner".to_string(),
            phone: "03001234567".to_string(),
            email: String::new(),
            address: "Lahore".to_string(),
            city: "Lahore".to_string(),
            country: "Pakistan".to_string(),
            currency: "PKR".to_string(),
            language: "en".to_string(),
        };

        save_business_profile(&path, &profile).expect("profile should save");
        assert_eq!(
            get_business_profile(&path)
                .expect("profile should load")
                .expect("profile should exist")
                .business_name,
            "Test Kiln"
        );

        let user = setup_admin_user(&path, "Kiln Admin", "admin", "password123")
            .expect("admin should be created");
        assert_eq!(user.role, "admin");
        assert!(admin_exists(&path).expect("admin check should run"));

        let login = login_user(&path, "admin", "password123")
            .expect("valid login should succeed");
        assert_eq!(login.user.id, user.id);
        assert_eq!(login.session.user_id, user.id);

        assert!(login_user(&path, "admin", "wrong-password")
            .unwrap_err()
            .contains("Invalid username or password"));

        cleanup(&path);
    }

    #[test]
    fn production_resources_and_completion_are_persisted_once() {
        let path = temp_database("production-resources");
        cleanup(&path);
        initialize(&path).expect("database should initialize");
        save_brick_grade(&path, BrickGrade {
            id: 0,
            name: "Production Grade".to_string(),
            description: String::new(),
            selling_price: 2.0,
            purchase_rate: 0.0,
            is_active: true,
            is_default: false,
        }).expect("grade should save");

        let batch = save_production_batch(&path, ProductionBatchRecord {
            id: 0,
            batch_number: "PROD-TEST-001".to_string(),
            brick_grade: "Production Grade".to_string(),
            planned_quantity: 100,
            produced_quantity: 0,
            damaged_quantity: 0,
            stage: "pathai".to_string(),
            status: "in_progress".to_string(),
            start_date: "2026-11-24".to_string(),
            expected_date: None,
            completed_date: None,
            notes: String::new(),
            created_at: String::new(),
            resources: vec![ProductionResourceRecord {
                id: 0,
                resource_name: "Coal".to_string(),
                quantity: 10.0,
                unit: "ton".to_string(),
                unit_cost: 50.0,
            }],
        }).expect("production batch should save");
        assert_eq!(batch.resources.len(), 1);
        assert_eq!(batch.resources[0].resource_name, "Coal");

        let mut completed = batch.clone();
        completed.produced_quantity = 60;
        completed.damaged_quantity = 2;
        completed.stage = "completed".to_string();
        completed.status = "completed".to_string();
        completed.completed_date = Some("2026-11-24".to_string());
        let completed = save_production_batch(&path, completed)
            .expect("completed batch should add good production to stock");
        assert_eq!(stock_for(&path, "Production Grade"), 58);
        assert_eq!(
            get_inventory(&path).unwrap().into_iter()
                .find(|item| item.grade_name == "Production Grade").unwrap().damaged_quantity,
            2
        );

        save_production_batch(&path, completed.clone())
            .expect("unchanged completed batch should save without re-adding stock");
        assert_eq!(stock_for(&path, "Production Grade"), 58);
        let mut changed = completed;
        changed.damaged_quantity = 1;
        assert!(save_production_batch(&path, changed).is_err());
        cleanup(&path);
    }

    #[test]
    fn migration_backfills_customer_accounts_for_existing_sales() {
        let path = temp_database("customer-backfill");
        cleanup(&path);
        initialize(&path).expect("database should initialize");
        save_brick_grade(&path, BrickGrade {
            id: 0,
            name: "Legacy Grade".to_string(),
            description: String::new(),
            selling_price: 2.0,
            purchase_rate: 0.0,
            is_active: true,
            is_default: false,
        }).expect("grade should save");
        adjust_inventory(&path, "Legacy Grade", 100, 10, "opening stock", "adjustment")
            .expect("opening stock should save");
        let sale = create_sale(&path, SaleRecord {
            id: 0,
            invoice_number: String::new(),
            customer_id: 0,
            customer_name: "Legacy Buyer".to_string(),
            customer_phone: "03001234567".to_string(),
            items: vec![SaleItemRecord {
                id: 0,
                brick_grade: "Legacy Grade".to_string(),
                quantity: 10,
                unit_price: 2.0,
                line_total: 20.0,
            }],
            subtotal: 20.0,
            discount: 0.0,
            tax: 0.0,
            grand_total: 20.0,
            paid_amount: 0.0,
            due_amount: 20.0,
            status: "confirmed".to_string(),
            payment_status: "unpaid".to_string(),
            sale_date: "2026-11-24".to_string(),
            notes: String::new(),
            created_at: String::new(),
        }).expect("legacy sale should save");

        let connection = open_connection(&path).expect("database should open");
        connection.execute_batch(
            "DROP TABLE customer_credits;
             DROP TABLE production_resources;
             DROP TABLE customers;
             ALTER TABLE sales_returns DROP COLUMN credit_amount;
             DELETE FROM schema_migrations WHERE version IN (5,6,7);
             UPDATE sales SET customer_id=0;",
        ).expect("database should represent the previous schema version");
        drop(connection);

        initialize(&path).expect("migration should upgrade the existing database");
        let customers = get_customers(&path).expect("customers should load");
        assert_eq!(customers.len(), 1);
        assert_eq!(customers[0].name, "Legacy Buyer");
        assert_eq!(customers[0].phone, "03001234567");
        let migrated_sale = get_sales(&path).unwrap().into_iter()
            .find(|item| item.id == sale.id).unwrap();
        assert_eq!(migrated_sale.customer_id, customers[0].id);
        assert!(migrated_sale.customer_id > 0);

        create_sale_return(&path, SaleReturnRecord {
            id: 0,
            sale_id: migrated_sale.id,
            invoice_number: migrated_sale.invoice_number,
            customer_name: migrated_sale.customer_name,
            brick_grade: "Legacy Grade".to_string(),
            quantity: 1,
            reason: "Legacy migration test".to_string(),
            status: "approved".to_string(),
            return_date: "2026-11-24".to_string(),
            credit_amount: 0.0,
            credit_applied: 0.0,
            credit_remaining: 0.0,
        }).expect("migrated sale should accept a return");
        cleanup(&path);
    }

    #[test]
    fn sales_payments_returns_and_stock_are_transactional() {
        let path = temp_database("sales-stock");
        cleanup(&path);
        initialize(&path).expect("database should initialize");
        save_brick_grade(&path, BrickGrade {
            id: 0,
            name: "Test Grade".to_string(),
            description: String::new(),
            selling_price: 2.0,
            purchase_rate: 0.0,
            is_active: true,
            is_default: false,
        }).expect("grade should save");
        adjust_inventory(&path, "Test Grade", 1_000, 100, "opening stock", "adjustment")
            .expect("opening stock should save");

        let sale = SaleRecord {
            id: 0,
            invoice_number: String::new(),
            customer_id: 0,
            customer_name: "Test Customer".to_string(),
            customer_phone: String::new(),
            items: vec![SaleItemRecord {
                id: 0,
                brick_grade: "Test Grade".to_string(),
                quantity: 100,
                unit_price: 2.0,
                line_total: 200.0,
            }],
            subtotal: 200.0,
            discount: 0.0,
            tax: 0.0,
            grand_total: 200.0,
            paid_amount: 0.0,
            due_amount: 200.0,
            status: "confirmed".to_string(),
            payment_status: "unpaid".to_string(),
            sale_date: "2026-11-24".to_string(),
            notes: String::new(),
            created_at: String::new(),
        };
        let mut created = create_sale(&path, sale.clone()).expect("sale should save");
        assert_eq!(stock_for(&path, "Test Grade"), 900);

        let edited = update_sale(&path, SaleRecord {
            id: created.id,
            invoice_number: created.invoice_number.clone(),
            items: vec![SaleItemRecord {
                id: 0,
                brick_grade: "Test Grade".to_string(),
                quantity: 120,
                unit_price: 2.0,
                line_total: 240.0,
            }],
            subtotal: 240.0,
            grand_total: 240.0,
            due_amount: 240.0,
            ..sale.clone()
        }).expect("unpaid sale should edit");
        created = edited;
        assert_eq!(stock_for(&path, "Test Grade"), 880);

        let paid = record_sale_payment(&path, SalePaymentRecord {
            id: 0,
            sale_id: created.id,
            amount: 50.0,
            method: "cash".to_string(),
            reference: String::new(),
            payment_date: "2026-11-24".to_string(),
            notes: String::new(),
        }).expect("payment should save");
        assert_eq!(paid.due_amount, 190.0);
        assert_eq!(paid.payment_status, "partial");

        let applied_credit = create_sale_return(&path, SaleReturnRecord {
            id: 0,
            sale_id: created.id,
            invoice_number: created.invoice_number.clone(),
            customer_name: created.customer_name.clone(),
            brick_grade: "Test Grade".to_string(),
            quantity: 10,
            reason: "Test return".to_string(),
            status: "approved".to_string(),
            return_date: "2026-11-24".to_string(),
            credit_amount: 0.0,
            credit_applied: 0.0,
            credit_remaining: 0.0,
        }).expect("return should save");
        assert_eq!(applied_credit.credit_amount, 20.0);
        assert_eq!(applied_credit.credit_applied, 20.0);
        assert_eq!(applied_credit.credit_remaining, 0.0);
        assert_eq!(stock_for(&path, "Test Grade"), 890);
        assert_eq!(
            get_sales(&path).unwrap().into_iter()
                .find(|sale| sale.id == created.id).unwrap().due_amount,
            170.0
        );
        record_sale_payment(&path, SalePaymentRecord {
            id: 0,
            sale_id: created.id,
            amount: 170.0,
            method: "cash".to_string(),
            reference: String::new(),
            payment_date: "2026-11-24".to_string(),
            notes: String::new(),
        }).expect("remaining balance should be payable");

        let extra_credit = create_sale_return(&path, SaleReturnRecord {
            id: 0,
            sale_id: created.id,
            invoice_number: created.invoice_number.clone(),
            customer_name: created.customer_name.clone(),
            brick_grade: "Test Grade".to_string(),
            quantity: 5,
            reason: "Additional return".to_string(),
            status: "approved".to_string(),
            return_date: "2026-11-24".to_string(),
            credit_amount: 0.0,
            credit_applied: 0.0,
            credit_remaining: 0.0,
        }).expect("additional return should save");
        assert_eq!(extra_credit.credit_amount, 10.0);
        assert_eq!(extra_credit.credit_applied, 0.0);
        assert_eq!(extra_credit.credit_remaining, 10.0);
        assert_eq!(get_customers(&path).unwrap()[0].credit_balance, 10.0);
        assert!(cancel_sale(&path, created.id).is_err());

        let cancelled = create_sale(&path, SaleRecord {
            items: vec![SaleItemRecord {
                id: 0,
                brick_grade: "Test Grade".to_string(),
                quantity: 20,
                unit_price: 2.0,
                line_total: 40.0,
            }],
            subtotal: 40.0,
            grand_total: 40.0,
            due_amount: 40.0,
            ..sale
        }).expect("second sale should save");
        assert_eq!(stock_for(&path, "Test Grade"), 875);
        cancel_sale(&path, cancelled.id).expect("unpaid sale should cancel");
        assert_eq!(stock_for(&path, "Test Grade"), 895);
        cleanup(&path);
    }

    #[test]
    fn seed_test_data_populates_and_resets_modules() {
        let path = temp_database("seed");
        cleanup(&path);

        initialize(&path).expect("database should initialize");
        seed_test_data(&path).expect("seed should run");

        assert_eq!(get_customers(&path).unwrap().len(), 50);
        assert_eq!(get_suppliers(&path).unwrap().len(), 20);
        assert_eq!(get_workers(&path).unwrap().len(), 30);
        assert_eq!(get_production_batches(&path).unwrap().len(), 50);
        assert_eq!(get_sales(&path).unwrap().len(), 50);
        assert_eq!(get_orders(&path).unwrap().len(), 50);
        assert_eq!(get_gate_passes(&path).unwrap().len(), 50);
        assert_eq!(get_wages(&path).unwrap().len(), 50);
        assert_eq!(get_expenses(&path).unwrap().len(), 50);
        assert_eq!(get_purchases(&path).unwrap().len(), 50);
        assert_eq!(get_coal_fuel(&path).unwrap().len(), 50);
        assert_eq!(get_transport(&path).unwrap().len(), 50);
        assert_eq!(get_invoices(&path).unwrap().len(), 50);
        assert_eq!(get_payments(&path).unwrap().len(), 50);
        assert_eq!(get_cashbook(&path).unwrap().len(), 50);
        assert!(get_sale_returns(&path).unwrap().len() >= 1);
        assert!(get_audit_logs(&path, 500).unwrap().len() >= 1);
        assert!(get_dashboard_data(&path).unwrap().total_sales > 0.0);

        // Grades must have non-zero selling prices so sales can be created.
        let grades = get_brick_grades(&path).unwrap();
        assert!(grades.iter().any(|g| g.is_active && g.selling_price > 0.0));

        // Re-running seed must clear and re-populate (not duplicate).
        seed_test_data(&path).expect("re-seed should run");
        assert_eq!(get_customers(&path).unwrap().len(), 50);
        assert_eq!(get_sales(&path).unwrap().len(), 50);

        cleanup(&path);
    }
}
