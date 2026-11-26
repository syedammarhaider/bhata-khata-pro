// ============================================================
// FILE 250
// PATH: src/features/gate-pass/components/GatePassMetricCard.tsx
// ============================================================

export function GatePassMetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
