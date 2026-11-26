/** @file Тесты загрузки товаров каталога (mock/api) с кэшем. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DATA_SOURCE } from '../src/config/env';
import { fetchProducts, resetCatalogCache } from '../src/data/api/products';

beforeEach(() => {
  resetCatalogCache();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe(fetchProducts.name, () => {
  it('в режиме mock возвращает товары из локальных фикстур', async () => {
    const products = await fetchProducts(DATA_SOURCE.mock);

    expect(products).toHaveLength(12);
    expect(new Set(products.map((product) => product.category)).size).toBe(4);
    products.forEach((product) => {
      expect(product.priceCents).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
    });
  });

  it('в режиме api загружает DTO, фильтрует по ассортименту и мапит в домен', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 1,
            title: 'Phone',
            description: '',
            category: 'smartphones',
            price: 100,
            thumbnail: 'u1',
            stock: 5,
          },
          {
            id: 2,
            title: 'Sofa',
            description: '',
            category: 'furniture',
            price: 200,
            thumbnail: 'u2',
            stock: 3,
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const products = await fetchProducts(DATA_SOURCE.api);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(products).toEqual([
      {
        id: 1,
        title: 'Phone',
        priceCents: 10000,
        category: 'smartphones',
        imageUrl: 'u1',
        stock: 5,
      },
    ]);
  });

  it('кэширует товары: повторный вызов не делает новый запрос', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchProducts(DATA_SOURCE.api);
    await fetchProducts(DATA_SOURCE.api);
    await fetchProducts(DATA_SOURCE.api);

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('бросает ошибку при неуспешном ответе API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(fetchProducts(DATA_SOURCE.api)).rejects.toThrow('500');
  });
});
