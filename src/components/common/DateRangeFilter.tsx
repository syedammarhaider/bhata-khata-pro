
import DateField from "./DateField";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  className = "",
}: DateRangeFilterProps) {
  const invalidRange =
    Boolean(startDate && endDate && startDate > endDate);

  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      <div className="min-w-[145px] flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
          From
        </label>
        <DateField
          value={startDate}
          max={endDate || undefined}
          onChange={onStartDateChange}
          aria-label="Start date"
        />
      </div>

      <div className="min-w-[145px] flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
          To
        </label>
        <DateField
          value={endDate}
          min={startDate || undefined}
          onChange={onEndDateChange}
          aria-label="End date"
          error={invalidRange}
        />
      </div>

      {onClear && (startDate || endDate) && (
        <button
          type="button"
          onClick={onClear}
          className="h-10 rounded-lg px-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
        >
          Clear
        </button>
      )}

      {invalidRange && (
        <p className="w-full text-xs text-red-600 dark:text-red-400" role="alert">
          End date cannot be earlier than start date.
        </p>
      )}
    </div>
  );
}
