// ============================================================
// FILE 289
// PATH: src/features/inventory/components/InventorySearch.tsx
// ============================================================

import SearchInput from "../../../components/common/SearchInput";
import { useAppStore } from "../../../app/store";
import { translateText } from "../../../lib/i18n";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function InventorySearch({ value, onChange }: Props) {
  const language = useAppStore((state) => state.language);
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={translateText("Search inventory...", language)}
    />
  );
}
