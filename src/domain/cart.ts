/** @file Доменные типы для корзины и расчёта стоимости заказа. */

/** Минимальные данные товара, необходимые для добавления в корзину. */
export interface CartProductInput {
  /** Идентификатор товара. */
  readonly id: number;

  /** Название товара. */
  readonly title: string;

  /** Цена за единицу товара в копейках (целое число). */
  readonly priceCents: number;

  /** Ссылка на изображение товара (необязательна). */
  readonly imageUrl?: string;
}

/** Позиция товара в корзине. */
export interface CartItem extends CartProductInput {
  /** Количество единиц товара в корзине (целое число не меньше 1). */
  readonly quantity: number;
}

/** Строка корзины с рассчитанной стоимостью позиции. */
export interface CartLine extends CartItem {
  /** Стоимость строки в копейках (`priceCents * quantity`). */
  readonly lineTotalCents: number;
}

/** Итоговый расчёт корзины с учётом промокода. */
export interface CartTotals {
  /** Рассчитанные строки корзины. */
  readonly lines: readonly CartLine[];

  /** Сумма всех позиций до скидки в копейках. */
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
