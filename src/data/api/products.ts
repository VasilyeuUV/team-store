/** @file Загрузка товаров каталога (mock/API) */

import { ACTIVE_DATA_SOURCE, API_BASE_URL, DATA_SOURCE } from '../../config/env';
import type { DataSource } from '../../config/env';
import type { Product } from '../../domain/product';
import type { ProductDummyJsonDto } from './product-dummyjson-dto';
import { CATEGORIES } from '../../config/constants';
import { getMockProducts } from '../mock/products';
import { mapProduct } from './map-dummy-product';

/**
 * Загрузить товары каталога.
 *
 * @param source - Источник данных (по умолчанию - активный из env).
 * @param signal - Сигнал отмены запроса.
 * @returns Товары из ассортимента магазина.
 */
export async function fetchProducts(
  source: DataSource = ACTIVE_DATA_SOURCE,
  signal?: AbortSignal,
): Promise<readonly Product[]> {
  if (source === DATA_SOURCE.mock) {
    return getMockProducts();
  }

  const response = await fetch(`${API_BASE_URL}/products?limit=0`, { signal });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить товары: HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  const products = (payload as { products?: readonly ProductDummyJsonDto[] }).products ?? [];
  const allowedCategories = new Set(CATEGORIES.map((category) => category.slug));

  return products.filter((dto) => allowedCategories.has(dto.category)).map(mapProduct);
}
