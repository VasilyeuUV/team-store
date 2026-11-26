/** @file Unit-тесты реактивного хранилища состояния корзины (cart-store). */

import { beforeEach, describe, expect, it } from 'vitest';
import type { Product } from '../src/domain/product';
import {
  addProductToCart,
  changeCartItemQuantity,
  clearCart,
  getCartCount,
  getCartItems,
  getCartPromoCode,
  getCartTotals,
  removeProductFromCart,
  setCartPromoCode,
  subscribeToCart,
} from '../src/services/cart-store';

const phone: Product = {
  id: 1,
  title: 'Смартфон X',
  priceCents: 59999,
  category: 'smartphones',
  imageUrl: 'https://example.com/phone.png',
  stock: 10,
};

describe('cart-store', () => {
  beforeEach(() => {
    clearCart();
  });

  it('добавляет товары, изменяет количество, применяет промокод и уведомляет подписчиков', () => {
    let notifiedCount = 0;
    const unsubscribe = subscribeToCart(() => {
      notifiedCount += 1;
    });

    addProductToCart(phone);
    addProductToCart(phone);
    expect(getCartCount()).toBe(2);
    expect(getCartItems()).toEqual([{ product: phone, quantity: 2 }]);

    changeCartItemQuantity(phone.id, -5);
    expect(getCartCount()).toBe(1);

    setCartPromoCode('SALE10');
    expect(getCartPromoCode()).toBe('SALE10');
    expect(getCartTotals().isPromoApplied).toBe(true);

    removeProductFromCart(phone.id);
    expect(getCartCount()).toBe(0);
    expect(notifiedCount).toBe(5);

    unsubscribe();
  });
});
