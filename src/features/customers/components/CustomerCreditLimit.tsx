// ============================================================
// FILE 339
// PATH: src/features/customers/components/CustomerCreditLimit.tsx
// ============================================================

interface Props {
  creditLimit: number;
  currentBalance: number;
}

export default function CustomerCreditLimit({
  creditLimit,
  currentBalance,
}: Props) {
  const remaining = Math.max(0, creditLimit - currentBalance);
  const exceeded = creditLimit > 0 && currentBalance > creditLimit;

  return (
    <div className="rounded-xl border p-4 dark:border-slate-800">
      <p className="text-sm text-slate-500">Credit Limit</p>
      <p className="mt-1 text-xl font-semibold">PKR {creditLimit.toLocaleString()}</p>
      <p className={`mt-2 text-sm ${exceeded ? "text-rose-600" : "text-emerald-600"}`}>
        {exceeded
          ? `Limit exceeded by PKR ${(currentBalance - creditLimit).toLocaleString()}`
          : `Remaining limit: PKR ${remaining.toLocaleString()}`}
      </p>
    </div>
  );
}
