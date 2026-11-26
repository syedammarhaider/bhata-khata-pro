// ============================================================
// FILE 209
// PATH: src/features/orders/components/OrderCustomerSelect.tsx
// ============================================================

export function OrderCustomerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Customer
      <input
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter customer name"
        required
      />
    </label>
  );
}
