// ============================================================
// FILE 324
// PATH: src/features/customers/components/CustomersSummaryCards.tsx
// ============================================================

import {
  Users,
  UserCheck,
  Wallet,
  CreditCard,
} from "lucide-react";
import StatCard from "../../../components/common/StatCard";
import type { CustomerSummary } from "../customers.types";

export default function CustomersSummaryCards({
  summary,
}: {
  summary: CustomerSummary;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Customers" value={summary.totalCustomers} icon={Users} />
      <StatCard title="Active Customers" value={summary.activeCustomers} icon={UserCheck} />
      <StatCard
        title="Total Receivable"
        value={`PKR ${summary.totalReceivable.toLocaleString()}`}
        icon={Wallet}
      />
      <StatCard
        title="Customers with Balance"
        value={summary.customersWithBalance}
        icon={CreditCard}
      />
    </div>
  );
}
