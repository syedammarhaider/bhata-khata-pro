// ============================================================
// FILE: src/lib/stockLookup.ts
// Helpers for matching grade names to inventory stock.
// ============================================================

const normalize = (value: string) =>
  (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Finds available stock for a grade name.
 * Tries exact match first, then normalized prefix matching
 * so "A" matches "A Grade" and "first" matches "First Class".
 */
export function findStockForGrade(
  stockByGrade: Record<string, number>,
  grade: string,
): number | undefined {
  const key = (grade ?? "").trim().toLowerCase();
  if (!key) return undefined;
  if (stockByGrade[key] !== undefined) return stockByGrade[key];

  const normKey = normalize(key);
  if (!normKey) return undefined;

  for (const [name, qty] of Object.entries(stockByGrade)) {
    const normName = normalize(name);
    if (!normName) continue;
    if (
      normName === normKey ||
      normName.startsWith(normKey) ||
      normKey.startsWith(normName)
    ) {
      return qty;
    }
  }
  return undefined;
}
