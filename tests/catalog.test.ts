/** @file Тесты сервиса каталога. */

import { describe, expect, it } from 'vitest';
import { filterProducts } from '../src/services/catalog';
import type { Product } from '../src/domain/product';

const makeProduct = (id: number, title: string, category: string, priceCents: number): Product => ({
  id,
  title,
  priceCents,
  category,
  imageUrl: '',
});

const laptops = 'laptops';

const products: Product[] = [
  makeProduct(1, 'iPhone 15', 'smartphones', 99900),
  makeProduct(2, 'Galaxy S24', 'smartphones', 79900),
  makeProduct(3, 'MacBook Air', laptops, 119900),
  makeProduct(4, 'iPad Air', 'tablets', 59900),
];

const noFilters = {
  search: '',
  category: null,
  minPriceCents: null,
  maxPriceCents: null,
};

describe('filterProducts', () => {
  it('возвращает все товары при пустых фильтрах', () => {
    expect(filterProducts(products, noFilters)).toEqual(products);
  });

  it('находит товары по части названия без учёта регистра', () => {
    const result = filterProducts(products, { ...noFilters, search: 'IPHONE' });
    expect(result.map((product) => product.id)).toEqual([1]);
  });

  it('не отсеивает товары при поиске из одних пробелов', () => {
    expect(filterProducts(products, { ...noFilters, search: '   ' })).toHaveLength(4);
  });

  it('фильтрует по категории', () => {
    const result = filterProducts(products, { ...noFilters, category: laptops });
    expect(result.map((product) => product.id)).toEqual([3]);
  });

  it('учитывает границы цены включительно', () => {
    const result = filterProducts(products, {
      ...noFilters,
      minPriceCents: 79900,
      maxPriceCents: 79900,
    });
    expect(result.map((product) => product.id)).toEqual([2]);
  });

  it('не применяет пустую верхнюю границу цены', () => {
    const result = filterProducts(products, { ...noFilters, minPriceCents: 60000 });
    expect(result.map((product) => product.id)).toEqual([1, 2, 3]);
  });

  it('применяет поиск и категорию одновременно', () => {
    const result = filterProducts(products, { ...noFilters, search: 'air', category: laptops });
    expect(result.map((p) => p.id)).toEqual([3]);
  });

  it('возвращает пустой массив, если совпадений нет', () => {
    expect(filterProducts(products, { ...noFilters, search: 'несуществующий' })).toEqual([]);
  });

  it('не мутирует исходный массив товаров', () => {
    filterProducts(products, { ...noFilters, category: laptops });
    expect(products.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });
});
