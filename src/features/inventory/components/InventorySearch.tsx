// ============================================================
// FILE 289
// PATH: src/features/inventory/components/InventorySearch.tsx
// ============================================================

import SearchInput from "../../../components/common/SearchInput";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function InventorySearch({ value, onChange }: Props) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Search inventory..."
    />
  );
}
