/** @file Фильтрация и сортировка каталога. */

import type { Product } from '../domain/product';

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
