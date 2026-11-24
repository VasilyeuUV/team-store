/** @file Карточка товара каталога. */

import { CATEGORIES } from '../../config/constants';
import type { Product } from '../../domain/product';
import { createElement } from '../dom';
import { formatPriceCents } from '../format';
import { createAddToCartButton } from './add-to-cart-button';

/**
 * Создаёт карточку товара.
 * @param product товар каталога
 * @returns элемент карточки
 */
export function createProductCard(product: Product): HTMLElement {
  const categoryLabel =
    CATEGORIES.find((category) => category.slug === product.category)?.label ?? product.category;

  return createElement('article', { className: 'product-card' }, [
    createElement('img', {
      className: 'product-card__image',
      attrs: {
        src: product.imageUrl,
        alt: product.title,
        loading: 'lazy',
        width: '240',
        height: '240',
      },
    }),
    createElement('h2', { className: 'product-card__title', text: product.title }),
    createElement('p', { className: 'product-card__category', text: categoryLabel }),
    createElement('p', {
      className: 'product-card__price',
      text: formatPriceCents(product.priceCents),
    }),
    createAddToCartButton(product),
  ]);
}
