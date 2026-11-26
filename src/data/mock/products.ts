/** @file Mock-источник товаров для разработки без API. */

import type { Product } from '../../domain/product';
import { mapProduct } from '../api/map-dummy-product';
import { PRODUCTS_FIXTURE } from '../fixtures/dummyjson-products.fixture';

/**
 * Вернуть товары для разработки из локальных фикстур.
 * @returns Массив доменных моделей товаров.
 */
export function getMockProducts(): readonly Product[] {
  return PRODUCTS_FIXTURE.map(mapProduct);
}
