/** @file Конфигурация промокодов и размеров скидок. */

/** Доступные промокоды: код → размер скидки в долях. */
export const PROMO_CODES: Readonly<Record<string, number>> = {
  SALE10: 0.1,
};
