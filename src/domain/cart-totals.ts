/** @file Доменная модель итогового расчёта корзины. */

import type { CartLine } from './cart-line';

/**
 * Итоговый расчёт корзины с учётом промокода.
 */
export interface CartTotals {
  /** Рассчитанные строки корзины. */
  readonly lines: readonly CartLine[];

  /** Сумма всех элементов до скидки в копейках. */
  readonly subtotalCents: number;

  /** Размер скидки по промокоду в копейках. */
  readonly discountCents: number;

  /** Итоговая сумма к оплате в копейках (`subtotalCents - discountCents`). */
  readonly totalCents: number;

  /** Код применённого промокода или `null`, если промокод не применён. */
  readonly appliedPromoCode: string | null;

  /** Признак успешного применения валидного промокода (`SALE10`). */
  readonly isPromoApplied: boolean;

  /** Признак того, что введён неизвестный (невалидный) промокод. */
  readonly isPromoInvalid: boolean;
}
