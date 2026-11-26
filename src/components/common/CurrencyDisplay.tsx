
interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  locale?: string;
  compact?: boolean;
  showSign?: boolean;
  className?: string;
}

export default function CurrencyDisplay({
  amount,
  currency = "PKR",
  locale = "en-PK",
  compact = false,
  showSign = false,
  className = "",
}: CurrencyDisplayProps) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  });

  const formatted = formatter.format(Math.abs(safeAmount));
  const sign = showSign && safeAmount > 0
    ? "+"
    : safeAmount < 0
      ? "−"
      : "";

  return (
    <span className={`inline-block tabular-nums ${className}`} dir="ltr">
      {sign}{formatted}
    </span>
  );
}
