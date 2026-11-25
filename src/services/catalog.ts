/** @file Фильтрация и сортировка каталога. */

import type { Product } from '../domain/product';
import { SortOrder } from '../config/constants';

/** Фильтры каталога. */
export interface CatalogFilters {
  readonly search: string;
  readonly categories: readonly string[];
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
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    if (filters.minPriceCents !== null && product.priceCents < filters.minPriceCents) return false;
    if (filters.maxPriceCents !== null && product.priceCents > filters.maxPriceCents) return false;
    return true;
  });
}

/**
 * Сортировать товары по цене.
 *
 * @param products - Товары каталога.
 * @param sort - Порядок сортировки.
 * @returns Новый массив товаров.
 */
export function sortProducts(products: readonly Product[], sort: SortOrder): Product[] {
  const result = [...products];
  if (sort === SortOrder.PriceAsc) result.sort((a, b) => a.priceCents - b.priceCents);
  if (sort === SortOrder.PriceDesc) result.sort((a, b) => b.priceCents - a.priceCents);

  return result;
}

/**
 * Применить фильтр и сортировку к каталогу.
 * @param products - Товары каталога.
 * @param filters - Активные фильтры.
 * @param sort - Порядок сортировки.
 * @returns Новый массив товаров.
 */
export function applyCatalog(
  products: readonly Product[],
  filters: CatalogFilters,
  sort: SortOrder,
): Product[] {
  return sortProducts(filterProducts(products, filters), sort);
}
