/** @file Маппер DTO товара из DummyJSON API в доменную модель. */

import type { Product } from '../../domain/product';
import type { ProductDummyJsonDto } from './product-dummyjson-dto';

/**
 * Преобразовать товар из DummyJSON API в доменную модель.
 * @param dto - DTO товара в формате сервера.
 * @returns Доменная модель товара.
 */
export function mapProduct(dto: ProductDummyJsonDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    priceCents: Math.round(dto.price * 100),
    category: dto.category,
    imageUrl: dto.thumbnail,
    stock: Math.max(0, Math.trunc(dto.stock ?? 0)),
  };
}
