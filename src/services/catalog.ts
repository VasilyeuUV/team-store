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
 */
export function filterProducts(products: readonly Product[], _filters: CatalogFilters): Product[] {
  return [...products];
}
