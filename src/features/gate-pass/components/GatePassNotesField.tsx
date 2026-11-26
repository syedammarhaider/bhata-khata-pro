// ============================================================
// FILE 262
// PATH: src/features/gate-pass/components/GatePassNotesField.tsx
// ============================================================

export function GatePassNotesField({
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
        maxLength={2000}
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
