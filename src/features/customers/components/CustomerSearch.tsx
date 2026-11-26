// ============================================================
// FILE 336
// PATH: src/features/customers/components/CustomerSearch.tsx
// ============================================================

import SearchInput from "../../../components/common/SearchInput";

export default function CustomerSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Search customers..."
    />
  );
}
