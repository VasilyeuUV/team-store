/** @file Общие константы приложения. */

import type { Category } from '../domain/product';

/** Название магазина. */
export const APP_TITLE = 'Techno Store';

/** Ассортимент магазина (категории товаров магазина). */
export const CATEGORIES = [
  { slug: 'smartphones', label: 'Смартфоны' },
  { slug: 'laptops', label: 'Ноутбуки' },
  { slug: 'tablets', label: 'Планшеты' },
  { slug: 'mobile-accessories', label: 'Аксессуары' },
] as const satisfies readonly Category[];
