// ============================================================
// FILE 178
// PATH: E:\BRICKSCS\src\features\sales\components\SalesInvoiceHeader.tsx
// ============================================================

import { FileText } from "lucide-react";
import type { SaleRecord } from "../sales.types";

interface SalesInvoiceHeaderProps {
  sale: SaleRecord;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
}

export default function SalesInvoiceHeader({
  sale,
  businessName = "Bhatta Khata Pro",
  businessAddress = "",
  businessPhone = "",
}: SalesInvoiceHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <FileText size={23} />
          <h2 className="text-xl font-bold">{businessName}</h2>
        </div>
        {businessAddress && <p className="text-sm">{businessAddress}</p>}
        {businessPhone && <p className="text-sm">{businessPhone}</p>}
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-wider text-slate-500">Sales invoice</p>
        <p className="mt-1 text-lg font-bold">{sale.invoiceNumber}</p>
      </div>
    </div>
  );
}
