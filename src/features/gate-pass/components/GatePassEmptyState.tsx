// ============================================================
// FILE 249
// PATH: src/features/gate-pass/components/GatePassEmptyState.tsx
// ============================================================

export function GatePassEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <p className="font-medium">No dispatch records</p>
      <p className="mt-1 text-sm text-slate-500">
        Create a gate pass when a shipment is ready.
      </p>
      {onCreate && (
        <button className="btn-primary mt-3" onClick={onCreate}>
          New gate pass
        </button>
      )}
    </div>
  );
}
