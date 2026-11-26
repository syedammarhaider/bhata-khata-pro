// ============================================================
// FILE 341
// PATH: src/features/customers/components/CustomerLedgerFilters.tsx
// ============================================================

interface Props {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export default function CustomerLedgerFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="text-sm">
        From
        <input type="date" value={startDate} onChange={(event) => onStartDateChange(event.target.value)} className="mt-1 block rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
      </label>
      <label className="text-sm">
        To
        <input type="date" value={endDate} onChange={(event) => onEndDateChange(event.target.value)} className="mt-1 block rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" />
      </label>
    </div>
  );
}
