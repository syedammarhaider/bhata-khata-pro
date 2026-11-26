
import type { CurrencyCode, ISODate, ISODateTime } from "../types";

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "PKR",
): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDate(
  date?: ISODate | ISODateTime | null,
): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatDateTime(
  date?: ISODateTime | null,
): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function getTodayISO(): ISODate {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentDateTime(): ISODateTime {
  return new Date().toISOString();
}

export function formatRelativeDate(date: string): string {
  const target = new Date(date);

  if (Number.isNaN(target.getTime())) return "—";

  const days = Math.floor(
    (new Date().getTime() - target.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days === -1) return "Tomorrow";

  if (days > 1 && days < 7) return `${days} days ago`;
  if (days < -1 && days > -7) return `In ${Math.abs(days)} days`;

  return formatDate(date);
}

export function formatPercentage(value: number): string {
  return `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}%`;
}

export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

export function calculateBalance(
  debit: number,
  credit: number,
): number {
  return Number((debit - credit).toFixed(2));
}

export function calculateRemaining(
  total: number,
  paid: number,
): number {
  return Number(Math.max(0, total - paid).toFixed(2));
}

export function calculateLineTotal(
  quantity: number,
  unitPrice: number,
  discount = 0,
): number {
  const subtotal = quantity * unitPrice;

  return Number(Math.max(0, subtotal - discount).toFixed(2));
}

export function calculateRunningBalance(
  previousBalance: number,
  debit: number,
  credit: number,
): number {
  return Number(
    (previousBalance + debit - credit).toFixed(2),
  );
}

export function generateReferenceNumber(
  prefix: string,
  sequence: number,
): string {
  return `${prefix}-${String(sequence).padStart(6, "0")}`;
}

export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function capitalize(value: string): string {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function titleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

export function truncateText(
  value: string,
  maxLength = 50,
): string {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^[+0-9()\-\s]{7,20}$/.test(phone.trim());
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function isNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8",
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function groupBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (result, item) => {
      const key = getKey(item);

      if (!result[key]) result[key] = [];

      result[key].push(item);

      return result;
    },
    {} as Record<K, T[]>,
  );
}

export function debounce<T extends (...args: never[]) => void>(
  callback: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function safeNumber(value: unknown): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
