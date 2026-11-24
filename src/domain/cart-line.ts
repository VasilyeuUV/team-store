/** @file Доменная модель рассчитанной строки корзины. */

import type { CartItem } from './cart-item';

/**
 * Строка корзины с рассчитанной стоимостью элемента.
 */
export interface CartLine extends CartItem {
  /** Стоимость строки в копейках (`product.priceCents * quantity`). */
  readonly lineTotalCents: number;
}
