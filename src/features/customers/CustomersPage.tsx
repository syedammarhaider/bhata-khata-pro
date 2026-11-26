// ============================================================
// FILE 323
// PATH: src/features/customers/CustomersPage.tsx
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import CustomersSummaryCards from "./components/CustomersSummaryCards";
import CustomersFilters from "./components/CustomersFilters";
import CustomersTable from "./components/CustomersTable";
import CustomersEmptyState from "./components/CustomersEmptyState";
import type { Customer, CustomerStatus } from "./customers.types";
import { calculateCustomerSummary, filterCustomers } from "./customers.utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    invoke<{
      id: number;
      customer_code: string;
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      credit_limit: number;
      outstanding_balance: number;
      credit_balance: number;
      status: CustomerStatus;
      created_at: string;
      updated_at: string;
    }[]>("get_customers")
      .then((records) => {
        if (!active) return;
        setCustomers(records.map((record) => ({
          id: String(record.id),
          customerCode: record.customer_code,
          name: record.name,
          phone: record.phone,
          email: record.email,
          address: record.address,
          city: record.city,
          openingBalance: 0,
          currentBalance: record.outstanding_balance - record.credit_balance,
          creditLimit: record.credit_limit,
          status: record.status,
          notes: "",
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        })));
      })
      .catch((err) => {
        if (active) setError(String(err));
      });
    return () => { active = false; };
  }, []);

  const summary = useMemo(
    () => calculateCustomerSummary(customers),
    [customers],
  );

  const filtered = useMemo(
    () => filterCustomers(customers, search, status),
    [customers, search, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer profiles, balances, and account history."
      />

      <CustomersSummaryCards summary={summary} />

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <SectionCard title="Customer Register">
        <CustomersFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        {filtered.length ? (
          <CustomersTable customers={filtered} />
        ) : (
          <CustomersEmptyState />
        )}
      </SectionCard>
    </div>
  );
}
