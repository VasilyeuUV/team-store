/** @file Сборка URL запроса товаров DummyJSON. */

import { API_BASE_URL } from '../../config/env';
import { SortOrder } from '../../config/constants';

/** Параметры запроса товаров. */
export interface ProductsQuery {
  /** Поисковая строка. */
  readonly search: string;

  /** Порядок сортировки. */
  readonly sort: SortOrder;

  /** Номер страницы (начиная с 1). */
  readonly page: number;

  /** Количество товаров на странице. */
  readonly pageSize: number;
}

/** Поля товара, которые запрашиваем у API. */
const SELECT_FIELDS = 'id,title,category,price,thumbnail,stock';

/**
 * Собирает URL запроса товаров.
 * @param query параметры запроса
 * @param baseUrl базовый адрес API
 * @returns абсолютный URL запроса
 */
export function buildProductsUrl(query: ProductsQuery, baseUrl: string = API_BASE_URL): string {
  const pageSize = Math.max(1, Math.trunc(query.pageSize));
  const page = Math.max(1, Math.trunc(query.page));
  const search = query.search.trim();

  const params = new URLSearchParams();
  params.set('limit', String(pageSize));
  params.set('skip', String((page - 1) * pageSize));
  params.set('select', SELECT_FIELDS);

  if (query.sort === SortOrder.PriceAsc) {
    params.set('sortBy', 'price');
    params.set('order', 'asc');
  } else if (query.sort === SortOrder.PriceDesc) {
    params.set('sortBy', 'price');
    params.set('order', 'desc');
  }

  const path = search === '' ? '/products' : '/products/search';
  if (search !== '') {
    params.set('q', search);
  }

  return `${baseUrl}${path}?${params.toString()}`;
}
