// ============================================================
// FILE 238
// PATH: src/features/orders/components/OrderErrorState.tsx
// ============================================================

export function OrderErrorState({
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
      <p className="font-semibold">Unable to load orders</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 underline">
          Try again
        </button>
      )}
    </div>
  );
}
