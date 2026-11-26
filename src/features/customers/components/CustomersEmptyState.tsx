// ============================================================
// FILE 327
// PATH: src/features/customers/components/CustomersEmptyState.tsx
// ============================================================

import EmptyState from "../../../components/common/EmptyState";
import { Users } from "lucide-react";

export default function CustomersEmptyState() {
  return (
    <EmptyState
      title="No customers found"
      description="Add a customer to start maintaining customer accounts and khata records."
      icon={Users}
    />
  );
}
