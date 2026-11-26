// ============================================================
// FILE 224
// PATH: src/features/orders/components/OrderQuantityField.tsx
// ============================================================

export function OrderQuantityField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-sm">
      Quantity
      <input
        type="number"
        min="1"
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
      />
    </label>
  );
}
