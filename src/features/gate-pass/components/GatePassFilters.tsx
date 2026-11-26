// ============================================================
// FILE 245
// PATH: src/features/gate-pass/components/GatePassFilters.tsx
// ============================================================

export function GatePassFilters({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <input
      className="form-input w-full"
      placeholder="Search pass, customer or vehicle..."
      value={search}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
