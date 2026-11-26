// ============================================================
// FILE 356
// PATH: src/features/customers/components/CustomerLoading.tsx
// ============================================================

export default function CustomerLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
