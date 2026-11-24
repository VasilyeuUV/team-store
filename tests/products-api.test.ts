/** @file Тесты загрузки товаров каталога (mock/api) */

import { describe, expect, it, afterEach, vi } from 'vitest';
import { DATA_SOURCE } from '../src/config/env';
import { fetchProducts } from '../src/data/api/products';

/** Хук жизненного цикла теста (запускается после завершения каждого теста в текущей области видимости). */
afterEach(() => {
  /** Восстановить измененные глобальные переменные. */
  vi.unstubAllGlobals();
});

describe(fetchProducts.name, () => {
  it('в режиме mock возвращает товары из локальных фикстур', async () => {
    const products = await fetchProducts(DATA_SOURCE.mock);

    expect(products).toHaveLength(12);
    expect(new Set(products.map((p) => p.category)).size).toBe(4);
    products.forEach((p) => expect(p.priceCents).toBeGreaterThan(0));
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
          },
          {
            id: 2,
            title: 'Sofa',
            description: '',
            category: 'furniture',
            price: 200,
            thumbnail: 'u2',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const products = await fetchProducts(DATA_SOURCE.api);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(products).toEqual([
      { id: 1, title: 'Phone', priceCents: 10000, category: 'smartphones', imageUrl: 'u1' },
    ]);
  });

  it('бросает ошибку при неуспешном ответе API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(fetchProducts(DATA_SOURCE.api)).rejects.toThrow('500');
  });
});
