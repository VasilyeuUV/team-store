/** @file Панель фильтров каталога (aside) и сортировка. */

import { CATEGORIES } from '../../config/constants';
import { SortOrder } from '../../services/catalog';
import { createElement } from '../dom';
import { createCategoryCombobox } from './category-combobox';
import { createPriceRange } from './price-range';

/** Значения фильтров (без поиска). */
export interface CatalogFilterValues {
  readonly categories: readonly string[];
  readonly minPriceCents: number;
  readonly maxPriceCents: number;
}

/** Публичный интерфейс панели фильтров. */
export interface CatalogFiltersPanel {
  readonly element: HTMLElement;
  readonly toolbar: HTMLElement;
  getValues: () => CatalogFilterValues;
  getSort: () => SortOrder;
  setPriceBounds: (minCents: number, maxCents: number) => void;
  reset: () => void;
}

/**
 * Создаёт панель фильтров и сортировки.
 * @param onChange колбэк при изменении фильтров
 * @returns элементы и методы управления
 */
export function createCatalogFilters(onChange: () => void): CatalogFiltersPanel {
  const categoryCombobox = createCategoryCombobox(CATEGORIES, onChange);
  const priceRange = createPriceRange(onChange);

  const sortSelect = createElement('select', { attrs: { 'aria-label': 'Сортировка' } }, [
    createElement('option', { text: 'По умолчанию', attrs: { value: SortOrder.Default } }),
    createElement('option', { text: 'Цена: по возрастанию', attrs: { value: SortOrder.PriceAsc } }),
    createElement('option', { text: 'Цена: по убыванию', attrs: { value: SortOrder.PriceDesc } }),
  ]);
  sortSelect.addEventListener('change', onChange);

  const reset = (): void => {
    categoryCombobox.reset();
    priceRange.reset();
  };

  const resetButton = createElement('button', {
    className: 'btn',
    text: 'Сбросить фильтры',
    attrs: { type: 'button' },
  });
  resetButton.addEventListener('click', () => {
    reset();
    onChange();
  });

  const aside = createElement('aside', { className: 'catalog__aside' }, [
    categoryCombobox.element,
    priceRange.element,
    resetButton,
  ]);

  const toolbar = createElement('div', { className: 'catalog__toolbar' }, [sortSelect]);

  return {
    element: aside,
    toolbar,
    getValues: () => {
      const prices = priceRange.getValues();
      return {
        categories: categoryCombobox.getSelected(),
        minPriceCents: prices.minCents,
        maxPriceCents: prices.maxCents,
      };
    },
    getSort: () => sortSelect.value as SortOrder,
    setPriceBounds: priceRange.setBounds,
    reset,
  };
}
