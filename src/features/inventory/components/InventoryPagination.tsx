// ============================================================
// FILE 306
// PATH: src/features/inventory/components/InventoryPagination.tsx
// ============================================================

import Pagination from "../../../components/common/Pagination";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InventoryPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
