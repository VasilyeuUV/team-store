/** @file Форматирование сумм и текстовых значений для UI. */

/**
 * Форматирует сумму в целых копейках в строку с валютой (например, `$12.99`).
 * @param cents сумма в целых копейках
 * @returns отформатированная цена
 */
export function formatPriceCents(cents: number): string {
  const safeCents = Number.isFinite(cents) ? Math.round(cents) : 0;
  return `$${(safeCents / 100).toFixed(2)}`;
}
