// ============================================================
// FILE 217
// PATH: src/features/orders/components/OrderDateFilter.tsx
// ============================================================

export function OrderDateFilter({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (v: { from: string; to: string }) => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="date"
        className="form-input"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
      />
      <input
        type="date"
        className="form-input"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
      />
    </div>
  );
}
