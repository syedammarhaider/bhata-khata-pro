// ============================================================
// FILE 331
// PATH: src/features/customers/components/CustomerBalanceBadge.tsx
// ============================================================

export default function CustomerBalanceBadge({
  balance,
}: {
  balance: number;
}) {
  const label =
    balance > 0
      ? `Due PKR ${balance.toLocaleString()}`
      : balance < 0
        ? `Advance PKR ${Math.abs(balance).toLocaleString()}`
        : "Settled";

  const color =
    balance > 0
      ? "bg-amber-100 text-amber-700"
      : balance < 0
        ? "bg-sky-100 text-sky-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
