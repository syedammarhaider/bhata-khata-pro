// ============================================================
// FILE 357
// PATH: src/features/customers/components/CustomerErrorState.tsx
// ============================================================

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function CustomerErrorState({ message, onRetry }: Props) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/20">
      <h3 className="font-semibold text-rose-700 dark:text-rose-300">Customer Module Error</h3>
      <p className="mt-1 text-sm text-rose-700 dark:text-rose-200">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 rounded-lg border border-rose-300 px-3 py-2 text-sm">
          Retry
        </button>
      )}
    </div>
  );
}
