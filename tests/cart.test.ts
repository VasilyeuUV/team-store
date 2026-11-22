/** @file Unit-тесты чистых функций бизнес-логики корзины (TDD: шаг Red). */

import { describe, expect, it } from 'vitest';
import type { CartItem, CartProductInput } from '../src/domain/cart';
import {
  addCartItem,
  calcCart,
  calcCartLine,
  removeCartItem,
  updateCartItemQuantity,
} from '../src/services/cart';

const phone: CartProductInput = {
  id: 1,
  title: 'Смартфон X',
  priceCents: 59999,
};

const laptop: CartProductInput = {
  id: 2,
  title: 'Ноутбук Pro',
  priceCents: 129999,
};

const cable: CartProductInput = {
  id: 3,
  title: 'Кабель USB-C',
  priceCents: 333,
};

describe('addCartItem', () => {
  it('добавляет новый товар в пустую корзину с количеством 1', () => {
    const items = addCartItem([], phone);

    expect(items).toEqual([
      {
        id: 1,
        title: 'Смартфон X',
        priceCents: 59999,
        quantity: 1,
      },
    ]);
  });

  it('увеличивает quantity при повторном добавлении того же товара без дублирования строки', () => {
    const first = addCartItem([], phone);
    const second = addCartItem(first, phone);
    const third = addCartItem(second, laptop);
    const fourth = addCartItem(third, phone);

    expect(fourth).toHaveLength(2);
    expect(fourth[0]).toEqual({
      id: 1,
      title: 'Смартфон X',
      priceCents: 59999,
      quantity: 3,
    });
    expect(fourth[1]).toEqual({
      id: 2,
      title: 'Ноутбук Pro',
      priceCents: 129999,
      quantity: 1,
    });
  });

  it('не мутирует исходный массив позиций', () => {
    const initial: readonly CartItem[] = [{ ...phone, quantity: 1 }];
    const updated = addCartItem(initial, phone);

    expect(initial[0]?.quantity).toBe(1);
    expect(updated[0]?.quantity).toBe(2);
  });
});

describe('updateCartItemQuantity и removeCartItem', () => {
  it('увеличивает и уменьшает количество товара по шагу +1 / -1', () => {
    const initial: readonly CartItem[] = [{ ...phone, quantity: 2 }];

    const increased = updateCartItemQuantity(initial, phone.id, 1);
    expect(increased[0]?.quantity).toBe(3);

    const decreased = updateCartItemQuantity(increased, phone.id, -1);
    expect(decreased[0]?.quantity).toBe(2);
  });

  it('не уменьшает количество товара ниже 1', () => {
    const initial: readonly CartItem[] = [{ ...phone, quantity: 1 }];

    const afterMinusOne = updateCartItemQuantity(initial, phone.id, -1);
    expect(afterMinusOne[0]?.quantity).toBe(1);

    const afterMinusFive = updateCartItemQuantity(initial, phone.id, -5);
    expect(afterMinusFive[0]?.quantity).toBe(1);
  });

  it('удаляет товар из корзины по идентификатору', () => {
    const initial: readonly CartItem[] = [
      { ...phone, quantity: 2 },
      { ...laptop, quantity: 1 },
    ];

    const afterRemove = removeCartItem(initial, phone.id);
    expect(afterRemove).toEqual([{ ...laptop, quantity: 1 }]);
  });
});

describe('calcCartLine и calcCart', () => {
  it('рассчитывает lineTotalCents строки и итоговые суммы в целых копейках для нескольких товаров', () => {
    const items: readonly CartItem[] = [
      { ...phone, quantity: 2 },
      { ...laptop, quantity: 3 },
    ];

    expect(calcCartLine(items[0])).toEqual({
      ...phone,
      quantity: 2,
      lineTotalCents: 119998,
    });

    const totals = calcCart(items);
    expect(totals.lines).toEqual([
      { ...phone, quantity: 2, lineTotalCents: 119998 },
      { ...laptop, quantity: 3, lineTotalCents: 389997 },
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
  });

  it('применяет промокод SALE10 (−10% с округлением до целых копеек) и не накапливает скидку повторно', () => {
    const items: readonly CartItem[] = [{ ...cable, quantity: 1 }];

    const firstApply = calcCart(items, 'SALE10');
    expect(firstApply.subtotalCents).toBe(333);
    expect(firstApply.discountCents).toBe(33);
    expect(firstApply.totalCents).toBe(300);
    expect(firstApply.appliedPromoCode).toBe('SALE10');
    expect(firstApply.isPromoApplied).toBe(true);
    expect(firstApply.isPromoInvalid).toBe(false);

    const secondApply = calcCart(items, 'SALE10');
    expect(secondApply.discountCents).toBe(33);
    expect(secondApply.totalCents).toBe(300);
  });

  it('отклоняет неизвестный промокод: скидка 0 и признак невалидного кода', () => {
    const items: readonly CartItem[] = [{ ...phone, quantity: 1 }];

    const totals = calcCart(items, 'UNKNOWN20');
    expect(totals.subtotalCents).toBe(59999);
    expect(totals.discountCents).toBe(0);
    expect(totals.totalCents).toBe(59999);
    expect(totals.appliedPromoCode).toBeNull();
    expect(totals.isPromoApplied).toBe(false);
    expect(totals.isPromoInvalid).toBe(true);
  });
});
