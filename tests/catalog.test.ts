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

const products: Product[] = [
  makeProduct(1, 'iPhone 15', 'smartphones', 99900),
  makeProduct(2, 'Galaxy S24', 'smartphones', 79900),
  makeProduct(3, 'MacBook Air', 'laptops', 119900),
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
});
