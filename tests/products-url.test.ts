/** @file Тесты сборки URL запроса товаров. */

import { describe, expect, it } from 'vitest';
import { SortOrder } from '../src/config/constants';
import { buildProductsUrl } from '../src/data/api/products-url';

const base = 'https://api.test';

describe(buildProductsUrl.name, () => {
  it('без поиска строит /products с пагинацией и полями', () => {
    const url = new URL(
      buildProductsUrl({ search: '', sort: SortOrder.Default, page: 2, pageSize: 12 }, base),
    );

    expect(url.pathname).toBe('/products');
    expect(url.searchParams.get('limit')).toBe('12');
    expect(url.searchParams.get('skip')).toBe('12');
    expect(url.searchParams.get('select')).toBe('id,title,category,price,thumbnail,stock');
    expect(url.searchParams.has('sortBy')).toBe(false);
  });

  it('с поиском переходит на /products/search и кодирует строку', () => {
    const url = new URL(
      buildProductsUrl(
        { search: 'iphone 15', sort: SortOrder.Default, page: 1, pageSize: 12 },
        base,
      ),
    );

    expect(url.pathname).toBe('/products/search');
    expect(url.searchParams.get('q')).toBe('iphone 15');
  });

  it('добавляет сортировку по цене по возрастанию', () => {
    const url = new URL(
      buildProductsUrl({ search: '', sort: SortOrder.PriceAsc, page: 1, pageSize: 12 }, base),
    );

    expect(url.searchParams.get('sortBy')).toBe('price');
    expect(url.searchParams.get('order')).toBe('asc');
  });

  it('добавляет сортировку по цене по убыванию', () => {
    const url = new URL(
      buildProductsUrl({ search: '', sort: SortOrder.PriceDesc, page: 1, pageSize: 12 }, base),
    );

    expect(url.searchParams.get('order')).toBe('desc');
  });

  it('не допускает отрицательный skip', () => {
    const url = new URL(
      buildProductsUrl({ search: '', sort: SortOrder.Default, page: 0, pageSize: 12 }, base),
    );

    expect(url.searchParams.get('skip')).toBe('0');
  });
});
