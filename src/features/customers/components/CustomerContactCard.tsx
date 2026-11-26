// ============================================================
// FILE 338
// PATH: src/features/customers/components/CustomerContactCard.tsx
// ============================================================

import { Phone, MapPin } from "lucide-react";
import type { Customer } from "../customers.types";

export default function CustomerContactCard({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-xl border p-4 dark:border-slate-800">
      <h3 className="font-semibold">Contact Information</h3>
      <div className="mt-3 space-y-3 text-sm">
        <p className="flex items-center gap-2"><Phone size={16} />{customer.phone}</p>
        {customer.alternatePhone && (
          <p className="flex items-center gap-2"><Phone size={16} />{customer.alternatePhone}</p>
        )}
        <p className="flex items-center gap-2"><MapPin size={16} />{customer.address || "Address not provided"}</p>
        {customer.city && <p className="text-slate-500">{customer.city}</p>}
      </div>
    </div>
  );
}
