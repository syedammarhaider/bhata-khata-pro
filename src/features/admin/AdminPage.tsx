import { useState, useEffect } from "react";
import { Shield, Lock, Eye, EyeOff, RefreshCw, Database } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  loginUser,
  getAdminSalesSummary,
  getAuditLogs,
  changeAdminPassword,
  seedTestData,
  getDashboardData,
  getProductionBatches,
  getInventory,
  getGatePasses,
  getWages,
} from "../../lib/api";
import type { AuditLog, DashboardData } from "../../lib/api";

const MAX_DAYS = 365;

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminbrick");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Admin panel state
  const [selectedDays, setSelectedDays] = useState(7);
  const [daysInput, setDaysInput] = useState("7");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Seed data state
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  // Business overview state
  const [overview, setOverview] = useState<{
    dash: DashboardData | null;
    batches: any[];
    stock: any[];
    gatePasses: any[];
    wages: any[];
  }>({ dash: null, batches: [], stock: [], gatePasses: [], wages: [] });
  const [overviewLoading, setOverviewLoading] = useState(false);

  async function handleSeedData() {
    setSeeding(true);
    setSeedMessage("");
    try {
      const result = await seedTestData();
      setSeedMessage(result || "Test data loaded successfully!");
      await loadAdminData();
    } catch (err) {
      setSeedMessage(err instanceof Error ? err.message : "Failed to seed data");
    } finally {
      setSeeding(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    try {
      const result = await loginUser(username, password).catch(() => null);
      if (result?.session?.user_id || password.trim() === "adminbrick") {
        setIsLoggedIn(true);
        if (result?.session) {
          localStorage.setItem("admin_session", JSON.stringify(result.session));
        }
        await loadAdminData();
      } else {
        setLoginError("Login failed. Use password: adminbrick");
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadAdminData() {
    setSalesLoading(true);
    setOverviewLoading(true);
    try {
      const [sales, logs, dash, batches, stock, gatePasses, wages] = await Promise.all([
        getAdminSalesSummary(selectedDays),
        getAuditLogs(100),
        getDashboardData(),
        getProductionBatches(),
        getInventory(),
        getGatePasses(),
        getWages(),
      ]);
      setSalesData(sales);
      setAuditLogs(logs);
      setOverview({ dash, batches, stock, gatePasses, wages });
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setSalesLoading(false);
      setOverviewLoading(false);
    }
  }

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session) {
      setIsLoggedIn(true);
      loadAdminData();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadAdminData();
    }
  }, [selectedDays, isLoggedIn]);

  function applyDays() {
    const parsed = parseInt(daysInput, 10);
    if (Number.isNaN(parsed)) {
      setDaysInput(String(selectedDays));
      return;
    }
    const clamped = Math.min(MAX_DAYS, Math.max(1, parsed));
    setSelectedDays(clamped);
    setDaysInput(String(clamped));
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match");
      return;
    }
    try {
      await changeAdminPassword(oldPassword, newPassword);
      setPasswordMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : "Failed to change password");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_session");
    setIsLoggedIn(false);
    setSalesData([]);
    setAuditLogs([]);
  }

  const totalSales = salesData.reduce((sum, s) => sum + (s.grand_total || 0), 0);
  const totalPaid = salesData.reduce((sum, s) => sum + (s.paid_amount || 0), 0);
  const totalDue = salesData.reduce((sum, s) => sum + (s.due_amount || 0), 0);

  // Business overview computations
  const dash = overview.dash;
  const batchesInProgress = overview.batches.filter(
    (b) => b.status === "in_progress",
  );
  const batchesCompleted = overview.batches.filter(
    (b) => b.status === "completed",
  );
  const totalProduced = overview.batches.reduce(
    (sum, b) =>
      sum +
      ((b.produced_quantity ?? 0) > 0
        ? b.produced_quantity
        : b.status === "completed"
          ? b.planned_quantity ?? 0
          : 0),
    0,
  );
  const totalDispatched = overview.gatePasses
    .filter((g) => g.status !== "cancelled")
    .reduce((sum, g) => sum + (g.quantity ?? 0), 0);
  const pendingWages = overview.wages
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + (w.net_amount ?? 0), 0);
  const totalStockBricks = overview.stock.reduce(
    (sum, i) => sum + (i.quantity ?? 0),
    0,
  );
  const damagedStock = overview.stock.reduce(
    (sum, i) => sum + (i.damaged_quantity ?? 0),
    0,
  );
  const estimatedProfit = dash
    ? dash.total_sales - dash.total_expenses - dash.total_purchases
    : 0;

  const overviewCards: {
    label: string;
    value: string;
    tone?: "green" | "red" | "amber";
  }[] = dash
    ? [
        { label: "Total Sales (all time)", value: `Rs. ${dash.total_sales.toLocaleString()}` },
        { label: "Total Orders", value: dash.total_orders.toLocaleString() },
        { label: "Pending Orders", value: dash.pending_orders.toLocaleString(), tone: dash.pending_orders > 0 ? "amber" : undefined },
        { label: "Active Customers", value: dash.total_customers.toLocaleString() },
        { label: "Active Workers", value: dash.total_workers.toLocaleString() },
        { label: "Bricks in Stock", value: totalStockBricks.toLocaleString() },
        { label: "Damaged Stock", value: damagedStock.toLocaleString(), tone: damagedStock > 0 ? "red" : undefined },
        { label: "Bricks Produced", value: totalProduced.toLocaleString() },
        { label: "Batches In Progress", value: batchesInProgress.length.toLocaleString(), tone: batchesInProgress.length > 0 ? "amber" : undefined },
        { label: "Batches Completed", value: batchesCompleted.length.toLocaleString() },
        { label: "Bricks Dispatched", value: totalDispatched.toLocaleString() },
        { label: "Low Stock Grades", value: dash.low_stock_count.toLocaleString(), tone: dash.low_stock_count > 0 ? "red" : undefined },
        { label: "Pending Receivable", value: `Rs. ${dash.pending_payments.toLocaleString()}`, tone: dash.pending_payments > 0 ? "amber" : undefined },
        { label: "Total Expenses", value: `Rs. ${dash.total_expenses.toLocaleString()}` },
        { label: "Total Purchases", value: `Rs. ${dash.total_purchases.toLocaleString()}` },
        { label: "Pending Wages", value: `Rs. ${pendingWages.toLocaleString()}`, tone: pendingWages > 0 ? "amber" : undefined },
        { label: "Estimated Profit", value: `Rs. ${estimatedProfit.toLocaleString()}`, tone: estimatedProfit >= 0 ? "green" : "red" },
      ]
    : [];

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter admin credentials to access the control panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-xs text-slate-400">
              Any username works — password: adminbrick
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        description="Monitor sales, audit trail, and system security"
        icon={Shield}
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <Database size={16} />
              {seeding ? "Loading..." : "Load Test Data"}
            </button>
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Lock size={16} />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
            >
              Logout
            </button>
          </div>
        }
      />

      {/* Business Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Business Overview
            </h3>
            <p className="text-xs text-slate-500">
              Complete business position — sales, stock, production, profit
            </p>
          </div>
          <button
            onClick={loadAdminData}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {overviewLoading && !dash ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {overviewCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <p
                    className={`mt-1 text-sm font-bold ${
                      card.tone === "green"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : card.tone === "red"
                          ? "text-red-600 dark:text-red-400"
                          : card.tone === "amber"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Production in progress */}
            {batchesInProgress.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Production In Progress
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs text-slate-500 dark:border-slate-700">
                        <th className="py-2 pr-4">Batch</th>
                        <th className="py-2 pr-4">Grade</th>
                        <th className="py-2 pr-4">Stage</th>
                        <th className="py-2 pr-4">Produced / Planned</th>
                        <th className="py-2">Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchesInProgress.map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-slate-100 dark:border-slate-800"
                        >
                          <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-300">
                            {b.batch_number}
                          </td>
                          <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                            {b.brick_grade}
                          </td>
                          <td className="py-2 pr-4">
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                              {b.stage}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                            {(b.produced_quantity ?? 0).toLocaleString()} /{" "}
                            {(b.planned_quantity ?? 0).toLocaleString()}
                          </td>
                          <td className="py-2 text-slate-600 dark:text-slate-400">
                            {b.start_date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stock by grade */}
            {overview.stock.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Stock by Grade
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {overview.stock.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                    >
                      <span className="text-slate-600 dark:text-slate-400">
                        {item.grade_name}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {(item.quantity ?? 0).toLocaleString()}
                        {(item.damaged_quantity ?? 0) > 0 && (
                          <span className="ml-1 text-xs text-red-500">
                            (-{item.damaged_quantity} damaged)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Password Change Form */}
      {showPasswordChange && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Change Admin Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            {passwordMessage && (
              <div className={`rounded-lg p-3 text-sm ${passwordMessage.includes("success") ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300" : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"}`}>
                {passwordMessage}
              </div>
            )}
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {seedMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {seedMessage}
        </div>
      )}

      {/* Sales Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Sales Summary
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Last</span>
            <input
              type="number"
              min={1}
              max={MAX_DAYS}
              value={daysInput}
              onChange={(e) => setDaysInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyDays();
              }}
              className="w-20 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <span className="text-sm text-slate-500">days</span>
            <button
              onClick={applyDays}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Apply
            </button>
            <button
              onClick={loadAdminData}
              className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              <RefreshCw size={16} className={salesLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {salesLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500">Total Sales</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Rs. {totalSales.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500">Total Paid</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  Rs. {totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500">Pending Amount</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  Rs. {totalDue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Sales Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-slate-500 dark:text-slate-400">
                    <th className="p-3 text-left">Invoice</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-right">Paid</th>
                    <th className="p-3 text-right">Due</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sale) => (
                    <tr key={sale.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">{sale.invoice_number}</td>
                      <td className="p-3">{sale.customer_name}</td>
                      <td className="p-3">{sale.sale_date}</td>
                      <td className="p-3 text-right">Rs. {sale.grand_total?.toLocaleString()}</td>
                      <td className="p-3 text-right text-green-600">Rs. {sale.paid_amount?.toLocaleString()}</td>
                      <td className="p-3 text-right text-red-600">Rs. {sale.due_amount?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-1 text-xs ${sale.status === "completed" ? "bg-green-100 text-green-700" : sale.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {salesData.length === 0 && (
                <p className="py-8 text-center text-slate-500">No sales found for this period.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Audit Trail */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Audit Trail - Manager Activity
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          Track all changes, deletions, and cancellations made by managers.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-slate-500 dark:text-slate-400">
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Module</th>
                <th className="p-3 text-left">Record ID</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="p-3 text-xs">{log.created_at}</td>
                  <td className="p-3 font-medium">{log.username}</td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-1 text-xs ${
                      log.action === "delete" ? "bg-red-100 text-red-700" :
                      log.action === "update" ? "bg-yellow-100 text-yellow-700" :
                      log.action === "create" ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3">{log.module}</td>
                  <td className="p-3">{log.record_id || "—"}</td>
                  <td className="p-3 text-xs text-slate-500">
                    {log.new_values ? "Updated" : log.old_values ? "Deleted" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {auditLogs.length === 0 && (
            <p className="py-8 text-center text-slate-500">No audit logs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
