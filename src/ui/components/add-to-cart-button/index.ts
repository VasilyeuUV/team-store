/** @file Переиспользуемая кнопка добавления товара в корзину. */

import type { Product } from '../../domain/product';
import { addProductToCart } from '../../services/cart-store';
import { createElement } from '../dom';

/**
 * Создаёт кнопку «В корзину» для карточки товара каталога.
 * При клике добавляет товар через стор корзины (увеличивает количество без дублей).
 * @param product товар из каталога
 * @param label текст кнопки (по умолчанию «В корзину»)
 * @returns элемент кнопки
 */
export function createAddToCartButton(product: Product, label = 'В корзину'): HTMLButtonElement {
  const button = createElement('button', {
    className: 'btn btn--primary',
    text: label,
    attrs: {
      type: 'button',
      'data-add-to-cart': String(product.id),
    },
  });

  button.addEventListener('click', () => {
    addProductToCart(product);
  });

  return button;
}
