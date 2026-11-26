import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export interface RecentTransaction {
  id: string | number;
  reference: string;
  partyName: string;
  type: "receipt" | "payment" | "sale" | "expense";
  amount: number;
  date: string;
  status?: "completed" | "pending" | "cancelled";
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  currency?: string;
  onSelect?: (transaction: RecentTransaction) => void;
  emptyMessage?: string;
}

const typeLabels: Record<RecentTransaction["type"], string> = {
  receipt: "Receipt",
  payment: "Payment",
  sale: "Sale",
  expense: "Expense",
};

const statusClasses = {
  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  cancelled:
    "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
};

export default function RecentTransactions({
  transactions,
  currency = "PKR",
  onSelect,
  emptyMessage = "No transactions have been recorded yet.",
}: RecentTransactionsProps) {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="px-3 py-3 font-medium">Reference</th>
            <th className="px-3 py-3 font-medium">Party</th>
            <th className="px-3 py-3 font-medium">Type</th>
            <th className="px-3 py-3 font-medium">Date</th>
            <th className="px-3 py-3 text-right font-medium">Amount</th>
            <th className="px-3 py-3 font-medium">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((transaction) => {
            const isIncoming =
              transaction.type === "receipt" || transaction.type === "sale";

            return (
              <tr
                key={transaction.id}
                onClick={() => onSelect?.(transaction)}
                onKeyDown={(event) => {
                  if (
                    onSelect &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    onSelect(transaction);
                  }
                }}
                tabIndex={onSelect ? 0 : undefined}
                role={onSelect ? "button" : undefined}
                className={`text-slate-700 dark:text-slate-300 ${
                  onSelect
                    ? "cursor-pointer hover:bg-slate-50 focus:bg-slate-50 dark:hover:bg-slate-800/60 dark:focus:bg-slate-800/60"
                    : ""
                }`}
              >
                <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">
                  {transaction.reference}
                </td>

                <td className="px-3 py-3">{transaction.partyName}</td>

                <td className="px-3 py-3">
                  {typeLabels[transaction.type]}
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  {transaction.date}
                </td>

                <td className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  <span
                    className={
                      isIncoming
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {isIncoming ? (
                      <ArrowDownLeft className="mr-1 inline" size={14} />
                    ) : (
                      <ArrowUpRight className="mr-1 inline" size={14} />
                    )}
                    {currency} {formatAmount(transaction.amount)}
                  </span>
                </td>

                <td className="px-3 py-3">
                  {transaction.status && (
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClasses[transaction.status]}`}
                    >
                      {transaction.status}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
