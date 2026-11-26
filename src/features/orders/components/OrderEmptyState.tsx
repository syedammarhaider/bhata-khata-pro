// ============================================================
// FILE 220
// PATH: src/features/orders/components/OrderEmptyState.tsx
// ============================================================

export function OrderEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <p className="font-medium">No orders yet</p>
      <p className="mt-1 text-sm text-slate-500">
        Create an order to get started.
      </p>
      {onCreate && (
        <button onClick={onCreate} className="btn-primary mt-4">
          Create order
        </button>
      )}
    </div>
  );
}
