// ============================================================
// FILE 225
// PATH: src/features/orders/components/OrderPriceField.tsx
// ============================================================

export function OrderPriceField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-sm">
      Unit price
      <input
        type="number"
        min="0"
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      />
    </label>
  );
}
