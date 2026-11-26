// ============================================================
// FILE 226
// PATH: src/features/orders/components/OrderDiscountField.tsx
// ============================================================

export function OrderDiscountField({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <label className="block text-sm">
      Discount
      <input
        type="number"
        min="0"
        max={max}
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) =>
          onChange(Math.max(0, Math.min(max ?? Infinity, Number(e.target.value))))
        }
      />
    </label>
  );
}
