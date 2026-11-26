// ============================================================
// FILE 183
// PATH: E:\BRICKSCS\src\features\sales\components\SalesDateFilter.tsx
// ============================================================

interface SalesDateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export default function SalesDateFilter({ startDate, endDate, onStartDateChange, onEndDateChange }: SalesDateFilterProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-sm">From date
        <input type="date" value={startDate} max={endDate || undefined} onChange={(event) => onStartDateChange(event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 dark:border-slate-700 dark:bg-slate-800" />
      </label>
      <label className="block text-sm">To date
        <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => onEndDateChange(event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 dark:border-slate-700 dark:bg-slate-800" />
      </label>
    </div>
  );
}
