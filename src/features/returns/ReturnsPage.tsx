// FILE: src/features/returns/ReturnsPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getSaleReturns } from "../../lib/api";
import type { SaleReturn } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface ReturnRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  returnDate: string;
  brickGrade: string;
  quantity: number;
  reason: string;
  status: string;
  creditAmount: number;
  creditApplied: number;
  creditRemaining: number;
}

export default function ReturnsPage() {
  const [records, setRecords] = useState<ReturnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSaleReturns();
        setRecords((data as SaleReturn[]).map((r) => ({
          id: String(r.id),
          invoiceNumber: r.invoice_number,
          customerName: r.customer_name,
          returnDate: r.return_date,
          brickGrade: r.brick_grade,
          quantity: r.quantity,
          reason: r.reason,
          status: r.status,
          creditAmount: r.credit_amount,
          creditApplied: r.credit_applied,
          creditRemaining: r.credit_remaining,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load returns");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((r) =>
      [r.customerName, r.reason, r.invoiceNumber, r.brickGrade].some((v) =>
        v.toLowerCase().includes(term)
      )
    );
  }, [records, search]);

  function handlePrint(record: ReturnRecord) {
    printRecord({
      title: "Sales Return",
      subtitle: record.invoiceNumber,
      sections: [
        {
          fields: [
            { label: "Return ID", value: record.id },
            { label: "Invoice", value: record.invoiceNumber },
            { label: "Customer", value: record.customerName },
            { label: "Date", value: record.returnDate },
            { label: "Brick Grade", value: record.brickGrade },
            { label: "Quantity", value: record.quantity.toLocaleString() },
            { label: "Credit Amount", value: `Rs. ${record.creditAmount.toLocaleString()}` },
            { label: "Credit Applied", value: `Rs. ${record.creditApplied.toLocaleString()}` },
            { label: "Credit Remaining", value: `Rs. ${record.creditRemaining.toLocaleString()}` },
            { label: "Reason", value: record.reason },
            { label: "Status", value: record.status },
          ],
        },
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Returns" description="Manage customer returns and stock adjustments." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search returns..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No returns yet" description="Returns will appear here when they are added." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Grade</th><th className="p-3">Qty</th><th className="p-3">Credit</th><th className="p-3">Reason</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.invoiceNumber}</td><td className="p-3">{record.customerName}</td><td className="p-3">{record.returnDate}</td><td className="p-3">{record.brickGrade}</td><td className="p-3">{record.quantity.toLocaleString()}</td><td className="p-3">Rs. {record.creditAmount.toLocaleString()}</td><td className="p-3">{record.reason}</td><td className="p-3 capitalize">{record.status}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
