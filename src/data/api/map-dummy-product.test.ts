/** @file Тесты маппинга DTO в домен. */

import { describe, expect, it } from 'vitest';
import { mapProduct } from './map-dummy-product';
import type { ProductDummyJsonDto } from './product-dummyjson-dto';

const dto: ProductDummyJsonDto = {
  id: 7,
  title: 'UltraBook',
  description: 'Ноутбук',
  category: 'laptops',
  price: 1299.99,
  thumbnail: 'https://example.com/a.png',
};

describe('mapProduct', () => {
  it('Маппинг DTO: перенести поля и перевести цену в копейки', () => {
    expect(mapProduct(dto)).toEqual({
      id: 7,
      title: 'UltraBook',
      priceCents: 129999,
      category: 'laptops',
      imageUrl: 'https://example.com/a.png',
    });
  });

  it('Корректность округления цены', () => {
    expect(mapProduct({ ...dto, price: 0.1 }).priceCents).toBe(10);
  });
});
