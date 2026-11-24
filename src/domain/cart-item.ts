/** @file Доменная модель элемента корзины. */

import type { Product } from './product';

/**
 * Элемент корзины.
 */
export interface CartItem {
  /** Товар из каталога. */
  readonly product: Product;

  /** Количество единиц товара в корзине (целое число не меньше 1). */
  readonly quantity: number;
}
