/** @file Загрузка товаров каталога (mock/API) с кэшированием. */

import { CATEGORIES } from '../../config/constants';
import { ACTIVE_DATA_SOURCE, API_BASE_URL, DATA_SOURCE } from '../../config/env';
import type { DataSource } from '../../config/env';
import type { Product } from '../../domain/product';
import { getMockProducts } from '../mock/products';
import { mapProduct } from './map-dummy-product';
import type { ProductDummyJsonDto } from './product-dummyjson-dto';

/** Кэш загруженных товаров. */
let catalogCache: readonly Product[] | null = null;

/** Источник данных, для которого получен кэш. */
let catalogCacheSource: DataSource | null = null;

/**
 * Загружает товары из API и оставляет только ассортимент магазина.
 * @param signal сигнал отмены запроса
 * @returns товары ассортимента
 */
async function fetchProductsFromApi(signal?: AbortSignal): Promise<readonly Product[]> {
  const response = await fetch(`${API_BASE_URL}/products?limit=0`, { signal });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить товары: HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  const products = (payload as { products?: readonly ProductDummyJsonDto[] }).products ?? [];
  const allowedCategories = new Set<string>(CATEGORIES.map((category) => category.slug));

  return products.filter((dto) => allowedCategories.has(dto.category)).map(mapProduct);
}

/**
 * Загружает товары каталога с кэшированием.
 * @param source источник данных (по умолчанию активный из env)
 * @param signal сигнал отмены запроса
 * @returns товары ассортимента
 */
export async function fetchProducts(
  source: DataSource = ACTIVE_DATA_SOURCE,
  signal?: AbortSignal,
): Promise<readonly Product[]> {
  if (catalogCache !== null && catalogCacheSource === source) {
    return catalogCache;
  }

  const products =
    source === DATA_SOURCE.mock ? getMockProducts() : await fetchProductsFromApi(signal);

  catalogCache = products;
  catalogCacheSource = source;

  return products;
}

/** Сбрасывает кэш товаров (для тестов и ручного обновления). */
export function resetCatalogCache(): void {
  catalogCache = null;
  catalogCacheSource = null;
}
