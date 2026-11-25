/** @file Доменные типы для товара. */

/**
 * Тип Категории товара.
 */
export interface Category {
  /** Слаг категории (совпадает с API). */
  readonly slug: string;

  /** Отображаемое название категории товара. */
  readonly label: string;
}

/**
 * Тип модели Товара в каталоге.
 */
export interface Product {
  /** Идентификатор товара. */
  readonly id: number;

  /** Название товара. */
  readonly title: string;

  /** Цена товара в копейках (целое число). */
  readonly priceCents: number;

  /** Слаг категории товара. */
  readonly category: string;

  /** Ссылка на изображение товара */
  readonly imageUrl: string;

  /** Остаток на складе (целое число, 0 — нет в наличии). */
  readonly stock: number;
}
