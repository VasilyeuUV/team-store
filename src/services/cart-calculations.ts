/** @file Чистые функции расчёта элементов корзины и скидки по промокоду. */

import { PROMO_CODES } from '../config/promo-codes';
import type { CartItem } from '../domain/cart-item';
import type { CartLine } from '../domain/cart-line';
import type { CartTotals } from '../domain/cart-totals';
import type { Product } from '../domain/product';

/** Минимально допустимое количество единиц одного товара в корзине. */
export const MIN_CART_QUANTITY = 1;

/**
 * Добавляет товар в корзину или увеличивает количество существующего элемента.
 * @param items текущие элементы корзины
 * @param product добавляемый товар
 * @param quantity добавляемое количество (по умолчанию 1)
 * @returns новый массив элементов корзины
 */
export function addCartItem(
  items: readonly CartItem[],
  product: Product,
  quantity = MIN_CART_QUANTITY,
): CartItem[] {
  const addedQuantity = Math.max(MIN_CART_QUANTITY, Math.trunc(quantity));
  const hasExistingItem = items.some((item) => item.product.id === product.id);

  if (hasExistingItem) {
    return items.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + addedQuantity } : item,
    );
  }

  return [...items, { product, quantity: addedQuantity }];
}

/**
 * Изменяет количество товара в корзине на заданную величину, не опуская ниже 1.
 * @param items текущие элементы корзины
 * @param productId идентификатор товара
 * @param delta изменение количества (например, +1 или -1)
 * @returns новый массив элементов корзины
 */
export function updateCartItemQuantity(
  items: readonly CartItem[],
  productId: number,
  delta: number,
): CartItem[] {
  const step = Math.trunc(delta);

  return items.map((item) => {
    if (item.product.id !== productId) {
      return item;
    }

    const nextQuantity = Math.max(MIN_CART_QUANTITY, item.quantity + step);
    return { ...item, quantity: nextQuantity };
  });
}

/**
 * Удаляет элемент корзины по идентификатору товара.
 * @param items текущие элементы корзины
 * @param productId идентификатор удаляемого товара
 * @returns новый массив элементов без удалённого товара
 */
export function removeCartItem(items: readonly CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.product.id !== productId);
}

/**
 * Считает строку корзины со стоимостью элемента в копейках.
 * @param item элемент корзины
 * @returns строка корзины с полем `lineTotalCents`
 */
export function calcCartLine(item: CartItem): CartLine {
  return {
    ...item,
    lineTotalCents: item.product.priceCents * item.quantity,
  };
}

/**
 * Считает общее количество единиц всех товаров в корзине.
 * @param items элементы корзины
 * @returns суммарное количество единиц товаров
 */
export function calcCartCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Считает строки корзины, сумму до скидки, скидку по промокоду и итоговую сумму к оплате.
 * @param items элементы корзины
 * @param promoCode введённый промокод (необязателен)
 * @returns строки корзины, суммы в копейках и статус промокода
 */
export function calcCart(items: readonly CartItem[], promoCode?: string): CartTotals {
  const lines = items.map(calcCartLine);
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);

  const normalizedCode = promoCode?.trim().toUpperCase() ?? '';
  const discountRate = Object.hasOwn(PROMO_CODES, normalizedCode)
    ? PROMO_CODES[normalizedCode]
    : undefined;

  const isPromoApplied = discountRate !== undefined;
  const isPromoInvalid = normalizedCode !== '' && !isPromoApplied;
  const discountCents = isPromoApplied ? Math.round(subtotalCents * discountRate) : 0;
  const totalCents = subtotalCents - discountCents;
  const appliedPromoCode = isPromoApplied ? normalizedCode : null;

  return {
    lines,
    subtotalCents,
    discountCents,
    totalCents,
    appliedPromoCode,
    isPromoApplied,
    isPromoInvalid,
  };
}
