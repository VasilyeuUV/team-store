/** @file Поле поиска каталога. */

import { createElement } from '../../dom';
import './search-input.css';

/** Публичный интерфейс поля поиска. */
export interface CatalogSearch {
  readonly element: HTMLElement;
  getValue: () => string;
  reset: () => void;
}

/**
 * Создаёт поле поиска.
 * @param onInput колбэк при вводе
 * @returns элемент и методы управления
 */
export function createCatalogSearch(onInput: () => void): CatalogSearch {
  const input = createElement('input', {
    className: 'catalog__search-input',
    attrs: { type: 'search', placeholder: 'Поиск по названию', 'aria-label': 'Поиск по названию' },
  });

  input.addEventListener('input', onInput);

  return {
    element: createElement('div', { className: 'catalog__search' }, [input]),
    getValue: () => input.value,
    reset: () => {
      input.value = '';
    },
  };
}
