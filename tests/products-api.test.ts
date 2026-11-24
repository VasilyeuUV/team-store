/** @file Тесты загрузки товаров каталога (mock/api) */

import { describe, expect, it } from 'vitest';
import { DATA_SOURCE } from '../src/config/env';
import { fetchProducts } from '../sr/data/api/products';

describe(fetchProducts.name, () => {
  it('в режиме mock возвращает товары из локальных фикстур', async () => {
    const products = await fetchProducts(DATA_SOURCE.mock);

    expect(products).toHaveLength(12);
    expect(new Set(products.map((p) => p.category)).size).toBe(4);
    products.forEach((p) => expect(p.priceCents).toBeGreaterThan(0));
  });
});
