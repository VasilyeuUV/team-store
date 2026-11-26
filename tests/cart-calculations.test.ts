/** @file Unit-тесты чистых функций расчёта корзины и скидки SALE10. */

import { describe, expect, it } from 'vitest';
import type { CartItem } from '../src/domain/cart-item';
import type { Product } from '../src/domain/product';
import {
  addCartItem,
  calcCart,
  calcCartCount,
  calcCartLine,
  removeCartItem,
  updateCartItemQuantity,
} from '../src/services/cart-calculations';

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

const cable: Product = {
  id: 3,
  title: 'Кабель USB-C',
  priceCents: 333,
  category: 'mobile-accessories',
  imageUrl: 'https://example.com/cable.png',
  stock: 3,
};

describe('addCartItem', () => {
  it('добавляет новый товар в пустую корзину с количеством 1', () => {
    const items = addCartItem([], phone);

    expect(items).toEqual([
      {
        product: phone,
        quantity: 1,
      },
    ]);
  });

  it('увеличивает quantity при повторном добавлении того же товара без дублирования элемента', () => {
    const first = addCartItem([], phone);
    const second = addCartItem(first, phone);
    const third = addCartItem(second, laptop);
    const fourth = addCartItem(third, phone);

    expect(fourth).toHaveLength(2);
    expect(fourth[0]).toEqual({
      product: phone,
      quantity: 3,
    });
    expect(fourth[1]).toEqual({
      product: laptop,
      quantity: 1,
    });
  });

  it('не мутирует исходный массив элементов корзины', () => {
    const initial: readonly CartItem[] = [{ product: phone, quantity: 1 }];
    const updated = addCartItem(initial, phone);

    expect(initial[0]?.quantity).toBe(1);
    expect(updated[0]?.quantity).toBe(2);
  });

  it('не добавляет товар, которого нет на складе', () => {
    const outOfStock: Product = { ...phone, id: 9, stock: 0 };

    expect(addCartItem([], outOfStock)).toEqual([]);
  });

  it('не увеличивает количество выше остатка на складе', () => {
    const limited: Product = { ...phone, id: 8, stock: 2 };
    const first = addCartItem([], limited);
    const second = addCartItem(first, limited);
    const third = addCartItem(second, limited);

    expect(third).toEqual([{ product: limited, quantity: 2 }]);
  });
});

describe('updateCartItemQuantity и removeCartItem', () => {
  it('увеличивает и уменьшает количество товара по шагу +1 / -1', () => {
    const initial: readonly CartItem[] = [{ product: phone, quantity: 2 }];

    const increased = updateCartItemQuantity(initial, phone.id, 1);
    expect(increased[0]?.quantity).toBe(3);

    const decreased = updateCartItemQuantity(increased, phone.id, -1);
    expect(decreased[0]?.quantity).toBe(2);
  });

  it('не уменьшает количество товара ниже 1', () => {
    const initial: readonly CartItem[] = [{ product: phone, quantity: 1 }];

    const afterMinusOne = updateCartItemQuantity(initial, phone.id, -1);
    expect(afterMinusOne[0]?.quantity).toBe(1);

    const afterMinusFive = updateCartItemQuantity(initial, phone.id, -5);
    expect(afterMinusFive[0]?.quantity).toBe(1);
  });

  it('удаляет элемент из корзины по идентификатору товара', () => {
    const initial: readonly CartItem[] = [
      { product: phone, quantity: 2 },
      { product: laptop, quantity: 1 },
    ];

    const afterRemove = removeCartItem(initial, phone.id);
    expect(afterRemove).toEqual([{ product: laptop, quantity: 1 }]);
  });

  it('не поднимает количество выше остатка на складе', () => {
    const limited: Product = { ...phone, id: 8, stock: 2 };
    const items: readonly CartItem[] = [{ product: limited, quantity: 1 }];

    expect(updateCartItemQuantity(items, limited.id, 1)[0]?.quantity).toBe(2);
    expect(updateCartItemQuantity(items, limited.id, 5)[0]?.quantity).toBe(2);
  });
});

describe('calcCartLine, calcCartCount и calcCart', () => {
  it('рассчитывает lineTotalCents строки и итоговые суммы в целых копейках для нескольких товаров', () => {
    const items: readonly CartItem[] = [
      { product: phone, quantity: 2 },
      { product: laptop, quantity: 3 },
    ];

    expect(calcCartLine(items[0])).toEqual({
      product: phone,
      quantity: 2,
      lineTotalCents: 119998,
    });
    expect(calcCartCount(items)).toBe(5);

    const totals = calcCart(items);
    expect(totals.lines).toEqual([
      { product: phone, quantity: 2, lineTotalCents: 119998 },
      { product: laptop, quantity: 3, lineTotalCents: 389997 },
    ]);
    expect(totals.subtotalCents).toBe(509995);
    expect(totals.discountCents).toBe(0);
    expect(totals.totalCents).toBe(509995);
    expect(totals.appliedPromoCode).toBeNull();
    expect(totals.isPromoApplied).toBe(false);
    expect(totals.isPromoInvalid).toBe(false);
  });

  it('возвращает нулевые суммы для пустой корзины', () => {
    const totals = calcCart([]);

    expect(totals.lines).toEqual([]);
    expect(totals.subtotalCents).toBe(0);
    expect(totals.discountCents).toBe(0);
    expect(totals.totalCents).toBe(0);
    expect(totals.isPromoApplied).toBe(false);
    expect(totals.isPromoInvalid).toBe(false);
    expect(calcCartCount([])).toBe(0);
  });

  it('применяет промокод SALE10 (−10% с округлением до целых копеек) и не накапливает скидку повторно', () => {
    const items: readonly CartItem[] = [{ product: cable, quantity: 1 }];

    const firstApply = calcCart(items, 'SALE10');
    expect(firstApply.subtotalCents).toBe(333);
    expect(firstApply.discountCents).toBe(33);
    expect(firstApply.totalCents).toBe(300);
    expect(firstApply.appliedPromoCode).toBe('SALE10');
    expect(firstApply.isPromoApplied).toBe(true);
    expect(firstApply.isPromoInvalid).toBe(false);

    const secondApply = calcCart(items, ' sale10 ');
    expect(secondApply.discountCents).toBe(33);
    expect(secondApply.totalCents).toBe(300);
  });

  it('отклоняет неизвестный промокод: скидка 0 и признак невалидного кода', () => {
    const items: readonly CartItem[] = [{ product: phone, quantity: 1 }];

    const totals = calcCart(items, 'UNKNOWN20');
    expect(totals.subtotalCents).toBe(59999);
    expect(totals.discountCents).toBe(0);
    expect(totals.totalCents).toBe(59999);
    expect(totals.appliedPromoCode).toBeNull();
    expect(totals.isPromoApplied).toBe(false);
    expect(totals.isPromoInvalid).toBe(true);
  });
});
