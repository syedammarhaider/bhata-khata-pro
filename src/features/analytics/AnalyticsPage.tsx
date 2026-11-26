// FILE: src/features/analytics/AnalyticsPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { getDashboardData, getSales, getExpenses, getPurchases } from "../../lib/api";
import type { DashboardData } from "../../lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [dash, saleRecords, expenseRecords, purchaseRecords] = await Promise.all([
          getDashboardData(),
          getSales(),
          getExpenses(),
          getPurchases(),
        ]);
        setData(dash);
        setSales(saleRecords);
        setExpenses(expenseRecords);
        setPurchases(purchaseRecords);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Monthly aggregation for the last 6 months
  const monthly = useMemo(() => {
    const now = new Date();
    const buckets: { label: string; sales: number; expenses: number; purchases: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        label: d.toLocaleString("en", { month: "short" }),
        sales: 0,
        expenses: 0,
        purchases: 0,
      });
    }
    const indexFor = (dateStr: string) => {
      const d = new Date(dateStr);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      return diff >= 0 && diff <= 5 ? 5 - diff : -1;
    };

    sales.forEach((s) => {
      const i = indexFor(s.sale_date);
      if (i >= 0) buckets[i].sales += s.grand_total ?? 0;
    });
    expenses.forEach((e) => {
      const i = indexFor(e.expense_date);
      if (i >= 0) buckets[i].expenses += e.amount ?? 0;
    });
    purchases.forEach((p) => {
      const i = indexFor(p.purchase_date);
      if (i >= 0) buckets[i].purchases += p.total ?? 0;
    });
    return buckets;
  }, [sales, expenses, purchases]);

  const maxValue = Math.max(
    1,
    ...monthly.flatMap((m) => [m.sales, m.expenses, m.purchases]),
  );

  if (loading) {
    return (
      <section className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <PageHeader title="Analytics" description="Business trends and performance analysis." />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Analytics" description="Business trends and performance analysis." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Sales", value: `Rs. ${(data?.total_sales ?? 0).toLocaleString()}`, color: "text-indigo-600" },
          { label: "Total Orders", value: (data?.total_orders ?? 0).toLocaleString(), color: "text-blue-600" },
          { label: "Total Production", value: `${(data?.total_production ?? 0).toLocaleString()} bricks`, color: "text-emerald-600" },
          { label: "Pending Payments", value: `Rs. ${(data?.pending_payments ?? 0).toLocaleString()}`, color: "text-amber-600" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className={`mt-1 text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Monthly Performance (last 6 months)</h3>
        <div className="space-y-4">
          {monthly.map((month, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="w-12 font-medium text-slate-500">{month.label}</span>
                <div className="flex gap-4 text-[10px]">
                  <span className="text-indigo-600">Sales {month.sales.toLocaleString()}</span>
                  <span className="text-red-500">Exp {month.expenses.toLocaleString()}</span>
                  <span className="text-amber-600">Pur {month.purchases.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="bg-indigo-500" style={{ width: `${(month.sales / maxValue) * 100}%` }} title={`Sales: ${month.sales}`} />
                <div className="bg-red-400" style={{ width: `${(month.expenses / maxValue) * 100}%` }} title={`Expenses: ${month.expenses}`} />
                <div className="bg-amber-400" style={{ width: `${(month.purchases / maxValue) * 100}%` }} title={`Purchases: ${month.purchases}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500"></span> Sales</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400"></span> Expenses</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400"></span> Purchases</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Top Customers (by recent sales)</h3>
          <div className="space-y-2">
            {(data?.recent_sales ?? []).slice(0, 5).map((sale: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{sale.customer_name}</span>
                <span className="font-medium">Rs. {(sale.grand_total ?? 0).toLocaleString()}</span>
              </div>
            ))}
            {(data?.recent_sales ?? []).length === 0 && (
              <p className="text-sm text-slate-500">No sales recorded yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-2">
            {(data?.recent_expenses ?? []).slice(0, 5).map((exp: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{exp.category} — {exp.expense_date}</span>
                <span className="font-medium text-red-600">Rs. {(exp.amount ?? 0).toLocaleString()}</span>
              </div>
            ))}
            {(data?.recent_expenses ?? []).length === 0 && (
              <p className="text-sm text-slate-500">No expenses recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
