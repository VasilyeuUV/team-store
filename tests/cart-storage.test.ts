/** @file Unit-тесты загрузки, валидации и сохранения корзины в localStorage. */

import { describe, expect, it } from 'vitest';
import { CART_STORAGE_KEY } from '../src/config/storage';
import type { CartItem } from '../src/domain/cart-item';
import type { Product } from '../src/domain/product';
import { loadCartItems, parseStoredCartItems, saveCartItems } from '../src/services/cart-storage';
import type { CartStorage } from '../src/services/cart-storage';

const phone: Product = {
  id: 1,
  title: 'Смартфон X',
  priceCents: 59999,
  category: 'smartphones',
  imageUrl: 'https://example.com/phone.png',
  stock: 10,
};

const laptop: Product = {
  id: 2,
  title: 'Ноутбук Pro',
  priceCents: 129999,
  category: 'laptops',
  imageUrl: 'https://example.com/laptop.png',
  stock: 5,
};

describe('cart-storage', () => {
  it('сохраняет и загружает элементы корзины из хранилища', () => {
    const memory = new Map<string, string>();
    const storage: CartStorage = {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => {
        memory.set(key, value);
      },
    };

    const items: readonly CartItem[] = [
      { product: phone, quantity: 2 },
      { product: laptop, quantity: 1 },
    ];

    saveCartItems(items, storage);
    expect(memory.has(CART_STORAGE_KEY)).toBe(true);
    expect(loadCartItems(storage)).toEqual(items);
  });

  it('безопасно обрабатывает битый JSON и невалидные структуры CartItem', () => {
    expect(parseStoredCartItems(null)).toEqual([]);
    expect(parseStoredCartItems('')).toEqual([]);
    expect(parseStoredCartItems('{broken json')).toEqual([]);
    expect(parseStoredCartItems('{"not":"an array"}')).toEqual([]);

    const mixedRaw = JSON.stringify([
      { product: phone, quantity: 2 },
      { product: { ...phone, id: -5 }, quantity: 1 },
      { product: { ...phone, title: '' }, quantity: 1 },
      { product: phone, quantity: 0 },
      { product: null, quantity: 1 },
      { product: phone, quantity: 1 },
    ]);

    expect(parseStoredCartItems(mixedRaw)).toEqual([{ product: phone, quantity: 3 }]);
  });

  it('подставляет stock = 0, если в сохранённых данных его нет', () => {
    const legacy = JSON.stringify([
      {
        product: {
          id: 1,
          title: 'Смартфон X',
          priceCents: 59999,
          category: 'smartphones',
          imageUrl: '',
        },
        quantity: 1,
      },
    ]);

    expect(parseStoredCartItems(legacy)[0]?.product.stock).toBe(0);
  });
});
