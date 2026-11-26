// FILE: src/features/invoices/InvoicesPage.tsx
import { useMemo, useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getInvoices } from "../../lib/api";
import type { Invoice } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
}

export default function InvoicesPage() {
  const [records, setRecords] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInvoices();
        setRecords(data.map((inv: Invoice) => ({
          id: String(inv.id),
          invoiceNumber: inv.invoice_number,
          customerName: inv.customer_name,
          invoiceDate: inv.invoice_date,
          dueDate: inv.due_date,
          amount: inv.amount,
          paidAmount: inv.paid_amount,
          balance: inv.balance,
          status: inv.status,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visible = useMemo(
    () => records.filter(r => r.customerName.toLowerCase().includes(search.toLowerCase()) || r.invoiceNumber.toLowerCase().includes(search.toLowerCase())),
    [records, search]
  );

  function handlePrint(record: InvoiceRecord) {
    printRecord({
      title: "Invoice",
      subtitle: record.invoiceNumber,
      sections: [
        {
          fields: [
            { label: "Invoice Number", value: record.invoiceNumber },
            { label: "Customer", value: record.customerName },
            { label: "Invoice Date", value: record.invoiceDate },
            { label: "Due Date", value: record.dueDate },
            { label: "Amount", value: `Rs. ${record.amount.toLocaleString()}` },
            { label: "Paid", value: `Rs. ${record.paidAmount.toLocaleString()}` },
            { label: "Balance", value: `Rs. ${record.balance.toLocaleString()}` },
            { label: "Status", value: record.status },
          ],
        },
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Invoices" description="Manage customer invoices and billing records." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No invoices yet" description="Invoices will appear here when they are created." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Due Date</th><th className="p-3">Amount</th><th className="p-3">Paid</th><th className="p-3">Balance</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.invoiceNumber}</td><td className="p-3">{record.customerName}</td><td className="p-3">{record.invoiceDate}</td><td className="p-3">{record.dueDate}</td><td className="p-3">Rs. {record.amount.toLocaleString()}</td><td className="p-3">Rs. {record.paidAmount.toLocaleString()}</td><td className="p-3">Rs. {record.balance.toLocaleString()}</td><td className="p-3">{record.status}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
