// ============================================================
// FILE 348
// PATH: src/features/customers/components/CustomerDateSummary.tsx
// ============================================================

interface Props {
  startDate?: string;
  endDate?: string;
}

export default function CustomerDateSummary({ startDate, endDate }: Props) {
  return (
    <p className="text-sm text-slate-500">
      Ledger period: {startDate || "All dates"} to {endDate || "Today"}
    </p>
  );
}
