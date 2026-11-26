// ============================================================
// FILE 236
// PATH: src/features/orders/components/OrderPagination.tsx
// ============================================================

export function OrderPagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>Page {page} of {Math.max(1, pages)}</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
