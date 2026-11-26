// FILE 363: src/features/suppliers/SuppliersPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getSuppliers } from "../../lib/api";
import type { Supplier as ApiSupplier } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface SupplierRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  notes?: string;
  openingBalance?: number;
  currentBalance?: number;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

export default function SuppliersPage() {
  const [records, setRecords] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSuppliers();
        setRecords(data.map((s: ApiSupplier) => ({
          id: String(s.id),
          name: s.name,
          phone: s.phone,
          email: s.email,
          city: s.city,
          notes: s.address,
          openingBalance: 0,
          currentBalance: s.outstanding_balance,
          status: (s.status === "active" ? "active" : s.status === "inactive" ? "inactive" : "archived") as SupplierRecord["status"],
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load suppliers");
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
      [r.name, r.phone ?? "", r.email ?? "", r.city ?? ""].some((v) =>
        v.toLowerCase().includes(term)
      )
    );
  }, [records, search]);

  function handlePrint(record: SupplierRecord) {
    printRecord({
      title: "Supplier Record",
      subtitle: record.name,
      sections: [
        {
          fields: [
            { label: "Supplier Code", value: record.id },
            { label: "Name", value: record.name },
            { label: "Phone", value: record.phone },
            { label: "Email", value: record.email },
            { label: "City", value: record.city },
            { label: "Address", value: record.notes },
            { label: "Outstanding Balance", value: `Rs. ${(record.currentBalance ?? 0).toLocaleString()}` },
            { label: "Status", value: record.status },
            { label: "Created", value: record.createdAt },
          ],
        },
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Suppliers" description="Manage suppliers and review their activity." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search suppliers..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No suppliers yet" description="Supplier records will appear here when they are added." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">City</th><th className="p-3">Balance</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.name}</td><td className="p-3">{record.phone || "—"}</td><td className="p-3">{record.city || "—"}</td><td className="p-3">Rs. {(record.currentBalance ?? 0).toLocaleString()}</td><td className="p-3">{record.status}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
