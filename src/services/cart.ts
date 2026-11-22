/** @file Чистые функции бизнес-логики корзины и расчёта стоимости с промокодом. */

import type { CartItem, CartLine, CartProductInput, CartTotals } from '../domain/cart';

/** Минимально допустимое количество единиц одной позиции в корзине. */
export const MIN_CART_QUANTITY = 1;

/** Доступные промокоды: код → размер скидки в долях. */
export const PROMO_CODES: Readonly<Record<string, number>> = {
  SALE10: 0.1,
};

/**
 * Добавляет товар в корзину или увеличивает количество существующей позиции.
 * @param items текущие позиции корзины
 * @param product добавляемый товар
 * @param quantity добавляемое количество (по умолчанию 1)
 * @returns новый массив позиций корзины
 */
export function addCartItem(
  items: readonly CartItem[],
  product: CartProductInput,
  quantity = MIN_CART_QUANTITY,
): CartItem[] {
  const addedQuantity = Math.max(MIN_CART_QUANTITY, Math.trunc(quantity));
  const hasExistingItem = items.some((item) => item.id === product.id);

  if (hasExistingItem) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + addedQuantity } : item,
    );
  }

  return [...items, { ...product, quantity: addedQuantity }];
}

/**
 * Изменяет количество товара в корзине на заданную величину, не опуская ниже 1.
 * @param items текущие позиции корзины
 * @param productId идентификатор товара
 * @param delta изменение количества (например, +1 или -1)
 * @returns новый массив позиций корзины
 */
export function updateCartItemQuantity(
  items: readonly CartItem[],
  productId: number,
  delta: number,
): CartItem[] {
  const step = Math.trunc(delta);

  return items.map((item) => {
    if (item.id !== productId) {
      return item;
    }

    const nextQuantity = Math.max(MIN_CART_QUANTITY, item.quantity + step);
    return { ...item, quantity: nextQuantity };
  });
}

/**
 * Удаляет позицию товара из корзины по идентификатору.
 * @param items текущие позиции корзины
 * @param productId идентификатор удаляемого товара
 * @returns новый массив позиций без удалённого товара
 */
export function removeCartItem(items: readonly CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

/**
 * Считает строку корзины со стоимостью позиции в копейках.
 * @param item позиция корзины
 * @returns строка корзины с полем `lineTotalCents`
 */
export function calcCartLine(item: CartItem): CartLine {
  return {
    ...item,
    lineTotalCents: item.priceCents * item.quantity,
  };
}

/**
 * Считает строки корзины, сумму до скидки, скидку по промокоду и итоговую сумму к оплате.
 * @param items позиции корзины
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
