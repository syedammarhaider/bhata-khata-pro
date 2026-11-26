// FILE: src/features/purchases/PurchasesPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getPurchases } from "../../lib/api";
import type { Purchase as ApiPurchase } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface PurchaseRecord {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  purchaseDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  status: string;
  items: { item_name: string; quantity: number; unit: string; unit_price: number; total: number }[];
}

export default function PurchasesPage() {
  const [records, setRecords] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPurchases();
        setRecords(data.map((p: ApiPurchase) => ({
          id: String(p.id),
          purchaseNumber: p.purchase_number,
          supplierName: p.supplier_name,
          purchaseDate: p.purchase_date,
          subtotal: p.subtotal,
          tax: p.tax,
          totalAmount: p.total,
          paidAmount: p.paid_amount,
          paymentStatus: p.payment_status,
          status: p.status,
          items: p.items ?? [],
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load purchases");
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
      [r.supplierName, r.purchaseNumber].some((v) => v.toLowerCase().includes(term))
    );
  }, [records, search]);

  function handlePrint(record: PurchaseRecord) {
    printRecord({
      title: "Purchase Record",
      subtitle: record.purchaseNumber,
      sections: [
        {
          fields: [
            { label: "Purchase Number", value: record.purchaseNumber },
            { label: "Supplier", value: record.supplierName },
            { label: "Date", value: record.purchaseDate },
            { label: "Subtotal", value: `Rs. ${record.subtotal.toLocaleString()}` },
            { label: "Tax", value: `Rs. ${record.tax.toLocaleString()}` },
            { label: "Total", value: `Rs. ${record.totalAmount.toLocaleString()}` },
            { label: "Paid", value: `Rs. ${record.paidAmount.toLocaleString()}` },
            { label: "Payment Status", value: record.paymentStatus },
            { label: "Status", value: record.status },
          ],
        },
        ...(record.items.length > 0
          ? [{
              title: "Items",
              fields: record.items.map((item, i) => ({
                label: `${i + 1}. ${item.item_name} (${item.quantity} ${item.unit} @ Rs. ${item.unit_price})`,
                value: `Rs. ${item.total.toLocaleString()}`,
              })),
            }]
          : []),
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Purchases" description="Manage supplier purchases and purchase records." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search purchases..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No purchases yet" description="Purchases will appear here when they are added." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Purchase #</th><th className="p-3">Supplier</th><th className="p-3">Date</th><th className="p-3">Total</th><th className="p-3">Paid</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.purchaseNumber}</td><td className="p-3">{record.supplierName}</td><td className="p-3">{record.purchaseDate}</td><td className="p-3">Rs. {record.totalAmount.toLocaleString()}</td><td className="p-3">Rs. {record.paidAmount.toLocaleString()}</td><td className="p-3 capitalize">{record.paymentStatus}</td><td className="p-3 capitalize">{record.status}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
