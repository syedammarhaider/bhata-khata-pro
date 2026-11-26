// ============================================================
// FILE 218
// PATH: src/features/orders/components/OrderSearch.tsx
// ============================================================

export function OrderSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      className="form-input w-full"
      placeholder="Search order number or customer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
