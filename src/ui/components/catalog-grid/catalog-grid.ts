/** @file Сетка товаров каталога с состояниями загрузки и пустоты. */

import type { Product } from '../../../domain/product';
import { createElement } from '../../dom';
import { createProductCard } from '../product-card/product-card';
import './catalog-grid.css';

/** Публичный интерфейс сетки. */
export interface CatalogGrid {
  readonly element: HTMLElement;
  update: (products: readonly Product[]) => void;
  showMessage: (message: string) => void;
}

/**
 * Создаёт сетку товаров.
 * @returns элемент и методы обновления
 */
export function createCatalogGrid(): CatalogGrid {
  const grid = createElement('div', { className: 'catalog__grid' });
  const status = createElement('p', { className: 'catalog__status' });

  const showMessage = (message: string): void => {
    status.textContent = message;
    grid.replaceChildren(status);
  };

  const update = (products: readonly Product[]): void => {
    if (products.length === 0) {
      showMessage('Ничего не найдено');
      return;
    }

    grid.replaceChildren(...products.map(createProductCard));
  };

  showMessage('Загрузка товаров…');

  return { element: grid, update, showMessage };
}
