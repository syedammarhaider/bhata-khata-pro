// ============================================================
// FILE 277
// PATH: src/features/gate-pass/components/GatePassErrorState.tsx
// ============================================================

export function GatePassErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
    >
      <p className="font-semibold">Unable to load gate passes</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button className="mt-3 underline" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
