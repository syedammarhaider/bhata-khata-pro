// ============================================================
// FILE 196
// PATH: E:\BRICKSCS\src\features\sales\components\SalesCustomerSummary.tsx
// ============================================================

interface SalesCustomerSummaryProps {
  customerName: string;
  phone?: string;
  address?: string;
  invoiceCount?: number;
  outstanding?: number;
}

export default function SalesCustomerSummary({ customerName, phone, address, invoiceCount = 0, outstanding = 0 }: SalesCustomerSummaryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-semibold">{customerName}</h3>
      {phone && <p className="mt-1 text-sm text-slate-500">{phone}</p>}
      {address && <p className="mt-1 text-sm text-slate-500">{address}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 dark:border-slate-800">
        <div><p className="text-xs text-slate-500">Invoices</p><p className="mt-1 font-semibold">{invoiceCount}</p></div>
        <div><p className="text-xs text-slate-500">Outstanding</p><p className="mt-1 font-semibold">PKR {outstanding.toLocaleString("en-PK")}</p></div>
      </div>
    </div>
  );
}
