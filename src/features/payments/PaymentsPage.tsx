// FILE 413: src/features/payments/PaymentsPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getPayments } from "../../lib/api";
import type { Payment as ApiPayment } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface PaymentRecord {
  id: string;
  paymentNumber: string;
  name: string;
  partyType: string;
  paymentType: string;
  amount: number;
  method: string;
  date: string;
  reference: string;
  notes: string;
  status: string;
}

export default function PaymentsPage() {
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPayments();
        setRecords(data.map((p: ApiPayment) => ({
          id: String(p.id),
          paymentNumber: p.payment_number,
          name: p.party_name,
          partyType: p.party_type,
          paymentType: p.payment_type,
          amount: p.amount,
          method: p.payment_method,
          date: p.payment_date,
          reference: p.reference,
          notes: p.notes,
          status: p.status,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payments");
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
      [r.name, r.paymentNumber, r.method, r.notes].some((v) =>
        v.toLowerCase().includes(term)
      )
    );
  }, [records, search]);

  const totalAmount = visible.reduce((sum, r) => sum + (r.status === "completed" || r.status === "posted" ? r.amount : 0), 0);

  function handlePrint(record: PaymentRecord) {
    printRecord({
      title: record.paymentType === "receipt" ? "Payment Receipt" : "Payment Voucher",
      subtitle: record.paymentNumber,
      sections: [
        {
          fields: [
            { label: "Payment Number", value: record.paymentNumber },
            { label: "Party", value: record.name },
            { label: "Party Type", value: record.partyType },
            { label: "Type", value: record.paymentType },
            { label: "Date", value: record.date },
            { label: "Amount", value: `Rs. ${record.amount.toLocaleString()}` },
            { label: "Method", value: record.method },
            { label: "Reference", value: record.reference },
            { label: "Notes", value: record.notes },
            { label: "Status", value: record.status },
          ],
        },
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Payments & Ledger" description="Manage payments & ledger and review their activity." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search payments..." /></div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{visible.length} records</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Total: Rs. {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No payments yet" description="Payment records will appear here when they are added." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Payment #</th><th className="p-3">Party</th><th className="p-3">Type</th><th className="p-3">Date</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.paymentNumber}</td><td className="p-3">{record.name}</td><td className="p-3 capitalize">{record.paymentType}</td><td className="p-3">{record.date}</td><td className="p-3 font-medium">Rs. {record.amount.toLocaleString()}</td><td className="p-3 capitalize">{record.method}</td><td className="p-3 capitalize">{record.status}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
