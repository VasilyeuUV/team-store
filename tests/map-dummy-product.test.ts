/** @file Тесты маппинга DTO в домен. */

import { describe, expect, it } from 'vitest';
import { mapProduct } from '../src/data/api/map-dummy-product';
import type { ProductDummyJsonDto } from '../src/data/api/product-dummyjson-dto';

const dto: ProductDummyJsonDto = {
  id: 7,
  title: 'UltraBook',
  description: 'Ноутбук',
  category: 'laptops',
  price: 1299.99,
  thumbnail: 'https://example.com/a.png',
  stock: 10,
};

describe('mapProduct', () => {
  it('Маппинг DTO: перенести поля и перевести цену в копейки', () => {
    expect(mapProduct(dto)).toEqual({
      id: 7,
      title: 'UltraBook',
      priceCents: 129999,
      category: 'laptops',
      imageUrl: 'https://example.com/a.png',
      stock: 10,
    });
  });

  it('Корректность округления цены', () => {
    expect(mapProduct({ ...dto, price: 0.1 }).priceCents).toBe(10);
  });

  it('по умолчанию ставит stock = 0, если в DTO его нет', () => {
    const withoutStock: ProductDummyJsonDto = {
      id: 7,
      title: 'UltraBook',
      description: 'Ноутбук',
      category: 'laptops',
      price: 1299.99,
      thumbnail: 'https://example.com/a.png',
    };

    expect(mapProduct(withoutStock).stock).toBe(0);
  });
});
