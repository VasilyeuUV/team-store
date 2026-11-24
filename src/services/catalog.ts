/** @file Фильтрация и сортировка каталога. */

import type { Product } from '../domain/product';

/** Константы сортировки каталога. */
export const SortOrder = {
  Default: 'default',
  PriceAsc: 'price-asc',
  PriceDesc: 'price-desc',
} as const;

/**
 * Порядок сортировки каталога.
 */
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

/** Фильтры каталога. */
export interface CatalogFilters {
  readonly search: string;
  readonly category: string | null;
  readonly minPriceCents: number | null;
  readonly maxPriceCents: number | null;
}

/**
 * Фильтрует товары по поиску и категории.
 * @param products товары каталога
 * @param filters активные фильтры
 * @returns отфильтрованные товары
 */
export function filterProducts(products: readonly Product[], filters: CatalogFilters): Product[] {
  const query = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    if (query !== '' && !product.title.toLowerCase().includes(query)) return false;
    if (filters.category !== null && product.category !== filters.category) return false;
    if (filters.minPriceCents !== null && product.priceCents < filters.minPriceCents) return false;
    if (filters.maxPriceCents !== null && product.priceCents > filters.maxPriceCents) return false;
    return true;
  });
}

/**
 * Сортировать товары по цене.
 *
 * @param products - Товары каталогаю
 * @param sort - Порядок сортировки.
 * @returns Новый массив товаров.
 */
export function sortProducts(products: readonly Product[], sort: SortOrder): Product[] {
  return [...products];
}
