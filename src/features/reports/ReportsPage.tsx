// FILE: src/features/reports/ReportsPage.tsx
import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { getDashboardData } from "../../lib/api";
import type { DashboardData } from "../../lib/api";
import { printTable } from "../../lib/print";

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        setData(await getDashboardData());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function printReport() {
    if (!data) return;
    printTable({
      title: "Business Report",
      columns: ["Metric", "Value"],
      rows: [
        ["Total Sales", `PKR ${data.total_sales.toLocaleString()}`],
        ["Total Orders", data.total_orders.toLocaleString()],
        ["Pending Orders", data.pending_orders.toLocaleString()],
        ["Total Customers", data.total_customers.toLocaleString()],
        ["Total Inventory (bricks)", data.total_inventory.toLocaleString()],
        ["Low Stock Grades", data.low_stock_count.toLocaleString()],
        ["Total Workers", data.total_workers.toLocaleString()],
        ["Pending Payments", `PKR ${data.pending_payments.toLocaleString()}`],
        ["Total Expenses", `PKR ${data.total_expenses.toLocaleString()}`],
        ["Total Purchases", `PKR ${data.total_purchases.toLocaleString()}`],
        ["Total Production", data.total_production.toLocaleString()],
      ],
    });
  }

  if (loading) {
    return (
      <section className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-6">
        <PageHeader title="Reports" description="Business, financial and operational reports." />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error || "No data available"}
        </div>
      </section>
    );
  }

  const netCashFlow = data.total_sales + data.pending_payments - data.total_expenses - data.total_purchases;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Reports"
        description="Business, financial and operational reports."
        actions={
          <button type="button" onClick={printReport} className="rounded-lg border px-3 py-2.5 text-sm font-medium">
            Print report
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Production Report</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Orders:</span><span className="font-medium">{data.total_orders.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pending Orders:</span><span className="font-medium">{data.pending_orders.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Production:</span><span className="font-medium">{data.total_production.toLocaleString()} bricks</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Available Stock:</span><span className="font-medium">{data.total_inventory.toLocaleString()} bricks</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Low Stock Grades:</span><span className="font-medium">{data.low_stock_count.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Financial Report</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Sales:</span><span className="font-medium">Rs. {data.total_sales.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pending Payments:</span><span className="font-medium">Rs. {data.pending_payments.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Expenses:</span><span className="font-medium">Rs. {data.total_expenses.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Purchases:</span><span className="font-medium">Rs. {data.total_purchases.toLocaleString()}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Net Position:</span><span>Rs. {netCashFlow.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Operational Report</h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div><p className="text-slate-500">Customers</p><p className="text-xl font-semibold">{data.total_customers.toLocaleString()}</p></div>
            <div><p className="text-slate-500">Workers</p><p className="text-xl font-semibold">{data.total_workers.toLocaleString()}</p></div>
            <div><p className="text-slate-500">Inventory (bricks)</p><p className="text-xl font-semibold">{data.total_inventory.toLocaleString()}</p></div>
            <div><p className="text-slate-500">Recent Sales</p><p className="text-xl font-semibold">{data.recent_sales.length}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
