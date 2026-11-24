/** @file Переиспользуемая кнопка добавления товара в корзину. */

import type { Product } from '../../../domain/product';
import { addProductToCart, getCartItems } from '../../../services/cart-store';
import { createElement } from '../../dom';

/**
 * Создаёт кнопку «В корзину» для карточки товара каталога.
 * Показывает количество товара в корзине и учитывает остаток на складе.
 * @param product товар из каталога
 * @param label текст кнопки, когда товара нет в корзине
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

  const cartQuantity = (): number =>
    getCartItems().find((item) => item.product.id === product.id)?.quantity ?? 0;

  const renderLabel = (): void => {
    if (product.stock === 0) {
      button.textContent = 'Нет в наличии';
      button.disabled = true;
      return;
    }

    const quantity = cartQuantity();
    button.textContent = quantity > 0 ? `В корзине: ${quantity}` : label;
  };

  button.addEventListener('click', () => {
    addProductToCart(product);
    renderLabel();
  });

  renderLabel();

  return button;
}
