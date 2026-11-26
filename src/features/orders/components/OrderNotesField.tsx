// ============================================================
// FILE 227
// PATH: src/features/orders/components/OrderNotesField.tsx
// ============================================================

export function OrderNotesField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Notes
      <textarea
        rows={3}
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={2000}
      />
    </label>
  );
}
