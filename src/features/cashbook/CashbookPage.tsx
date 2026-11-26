// FILE: src/features/cashbook/CashbookPage.tsx
import { useMemo, useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getCashbook } from "../../lib/api";
import type { CashbookEntry } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface CashbookRecord {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  balance: number;
}

export default function CashbookPage() {
  const [records, setRecords] = useState<CashbookRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCashbook();
        setRecords(data.map((e: CashbookEntry) => ({
          id: String(e.id),
          date: e.entry_date,
          description: e.description,
          type: e.entry_type,
          amount: e.amount,
          balance: e.balance,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cashbook");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visible = useMemo(
    () => records.filter(r => r.description.toLowerCase().includes(search.toLowerCase())),
    [records, search]
  );

  function handlePrint(record: CashbookRecord) {
    printRecord({
      title: "Cashbook Entry",
      subtitle: record.id,
      sections: [
        {
          fields: [
            { label: "Date", value: record.date },
            { label: "Description", value: record.description },
            { label: "Type", value: record.type },
            { label: "Amount", value: `Rs. ${record.amount.toLocaleString()}` },
            { label: "Balance", value: `Rs. ${record.balance.toLocaleString()}` },
          ],
        },
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Cashbook" description="Track cash inflow, outflow and daily balance." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search cashbook..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No cashbook entries yet" description="Cashbook entries will appear here when they are added." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Date</th><th className="p-3">Description</th><th className="p-3">Type</th><th className="p-3">Amount</th><th className="p-3">Balance</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3">{record.date}</td><td className="p-3">{record.description}</td><td className="p-3"><span className={`px-2 py-1 rounded text-xs ${record.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{record.type}</span></td><td className="p-3">Rs. {record.amount.toLocaleString()}</td><td className="p-3">Rs. {record.balance.toLocaleString()}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
