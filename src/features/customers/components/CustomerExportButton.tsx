// ============================================================
// FILE 345
// PATH: src/features/customers/components/CustomerExportButton.tsx
// ============================================================

import type { Customer } from "../customers.types";

export default function CustomerExportButton({
  customers,
}: {
  customers: Customer[];
}) {
  function exportCsv() {
    const rows = [
      ["Code", "Name", "Phone", "City", "Opening Balance", "Current Balance", "Status"],
      ...customers.map((customer) => [
        customer.customerCode,
        customer.name,
        customer.phone,
        customer.city || "",
        String(customer.openingBalance),
        String(customer.currentBalance),
        customer.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "customers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={exportCsv} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
      Export Customers
    </button>
  );
}
