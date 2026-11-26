// FILE: src/features/transport/TransportPage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import PrintButton from "../../components/common/PrintButton";
import { getTransport } from "../../lib/api";
import type { Transport as ApiTransport } from "../../lib/api";
import { printRecord } from "../../lib/print";

interface TransportRecord {
  id: string;
  tripNumber: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  tripDate: string;
  route: string;
  bricksTransported: number;
  status: string;
  cost: number;
  notes: string;
}

export default function TransportPage() {
  const [records, setRecords] = useState<TransportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransport();
        setRecords(data.map((t: ApiTransport) => ({
          id: String(t.id),
          tripNumber: t.trip_number,
          vehicleNumber: t.vehicle_number,
          driverName: t.driver_name,
          driverPhone: t.driver_phone,
          tripDate: t.trip_date,
          route: t.route,
          bricksTransported: t.bricks_transported,
          status: t.status,
          cost: t.cost,
          notes: t.notes,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transport");
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
      [r.vehicleNumber, r.driverName, r.route, r.tripNumber].some((v) =>
        v.toLowerCase().includes(term)
      )
    );
  }, [records, search]);

  function handlePrint(record: TransportRecord) {
    printRecord({
      title: "Transport Trip",
      subtitle: record.tripNumber,
      sections: [
        {
          fields: [
            { label: "Trip Number", value: record.tripNumber },
            { label: "Vehicle", value: record.vehicleNumber },
            { label: "Driver", value: record.driverName },
            { label: "Driver Phone", value: record.driverPhone },
            { label: "Trip Date", value: record.tripDate },
            { label: "Route", value: record.route },
            { label: "Bricks Transported", value: record.bricksTransported.toLocaleString() },
            { label: "Cost", value: `Rs. ${record.cost.toLocaleString()}` },
            { label: "Status", value: record.status },
            { label: "Notes", value: record.notes },
          ],
        },
      ],
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Transport" description="Manage vehicles, drivers and transport trips." />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search transport..." /></div>
          <span className="text-sm text-slate-500">{visible.length} records</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No transport records yet" description="Transport records will appear here when they are added." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Trip #</th><th className="p-3">Vehicle</th><th className="p-3">Driver</th><th className="p-3">Route</th><th className="p-3">Bricks</th><th className="p-3">Cost</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.tripNumber}</td><td className="p-3">{record.vehicleNumber}</td><td className="p-3">{record.driverName}</td><td className="p-3">{record.route}</td><td className="p-3">{record.bricksTransported.toLocaleString()}</td><td className="p-3">Rs. {record.cost.toLocaleString()}</td><td className="p-3 capitalize">{record.status}</td><td className="p-3"><PrintButton onClick={() => handlePrint(record)} /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
