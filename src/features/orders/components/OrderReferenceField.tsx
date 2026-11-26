// ============================================================
// FILE 228
// PATH: src/features/orders/components/OrderReferenceField.tsx
// ============================================================

export function OrderReferenceField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Reference
      <input
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={80}
      />
    </label>
  );
}
