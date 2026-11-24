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
 * Фильтровать товары.
 *
 * @param products
 * @param filters
 * @returns
 */
export function filterProducts(products: readonly Product[], filters: CatalogFilters): Product[] {
  const query = filters.search.trim().toLowerCase();

  return products.filter((product) => query === '' || product.title.toLowerCase().includes(query));
}
