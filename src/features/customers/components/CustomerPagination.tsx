// ============================================================
// FILE 358
// PATH: src/features/customers/components/CustomerPagination.tsx
// ============================================================

import Pagination from "../../../components/common/Pagination";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CustomerPagination({
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
