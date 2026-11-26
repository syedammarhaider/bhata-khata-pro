// ============================================================
// FILE 229
// PATH: src/features/orders/components/OrderDeliveryDateField.tsx
// ============================================================

export function OrderDeliveryDateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Expected delivery date
      <input
        type="date"
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
