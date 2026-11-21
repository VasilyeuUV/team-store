/** @file Страница корзины — заглушка до реализации корзины. */
import { createElement } from '../dom';

/**
 * Создаёт содержимое страницы корзины.
 * @returns элемент страницы
 */
export function renderCartPage(): HTMLElement {
  return createElement('section', { className: 'page page--cart' }, [
    createElement('h1', { className: 'page__title', text: 'Корзина' }),
    createElement('p', { text: 'Корзина пока пуста.' }),
  ]);
}
