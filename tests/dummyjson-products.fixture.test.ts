/** @file Проверка целостности фикстур. */

import { expect, it } from 'vitest';
import { PRODUCTS_FIXTURE } from '../src/data/fixtures/dummyjson-products.fixture';

it('Содержит 12 товаров в 4 категориях с положительной ценой', () => {
  expect(PRODUCTS_FIXTURE).toHaveLength(12);
  expect(new Set(PRODUCTS_FIXTURE.map((p) => p.category)).size).toBe(4);
  PRODUCTS_FIXTURE.forEach((p) => expect(p.price).toBeGreaterThan(0));
});
