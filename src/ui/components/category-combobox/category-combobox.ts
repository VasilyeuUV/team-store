/** @file Комбобокс категорий: выпадающий список с чекбоксами. */

import type { Category } from '../../domain/product';
import { createElement } from '../dom';

/** Публичный интерфейс комбобокса. */
export interface CategoryCombobox {
  readonly element: HTMLElement;
  getSelected: () => string[];
  reset: () => void;
}

/**
 * Создаёт комбобокс с множественным выбором категорий.
 * @param categories доступные категории
 * @param onChange колбэк при изменении выбора
 * @returns элемент и методы управления
 */
export function createCategoryCombobox(
  categories: readonly Category[],
  onChange: () => void,
): CategoryCombobox {
  const checkboxes = categories.map((category) => ({
    category,
    input: createElement('input', { attrs: { type: 'checkbox', value: category.slug } }),
  }));

  const summary = createElement('summary', {
    className: 'combobox__summary',
    text: 'Все категории',
  });

  const allCheckbox = createElement('input', { attrs: { type: 'checkbox' } });
  allCheckbox.checked = true;

  const panel = createElement('div', { className: 'combobox__panel' }, [
    createElement('label', { className: 'combobox__option' }, [
      allCheckbox,
      createElement('span', { text: 'Все категории' }),
    ]),
    ...checkboxes.map(({ category, input }) =>
      createElement('label', { className: 'combobox__option' }, [
        input,
        createElement('span', { text: category.label }),
      ]),
    ),
  ]);

  const details = createElement('details', { className: 'combobox' }, [summary, panel]);

  const updateSummary = (): void => {
    const selected = checkboxes.filter(({ input }) => input.checked);
    summary.textContent =
      selected.length === 0
        ? 'Все категории'
        : selected.length === 1
          ? selected[0].category.label
          : `Выбрано: ${selected.length}`;
  };

  const reset = (): void => {
    allCheckbox.checked = true;
    checkboxes.forEach(({ input }) => {
      input.checked = false;
    });
    updateSummary();
  };

  allCheckbox.addEventListener('change', () => {
    if (allCheckbox.checked) {
      checkboxes.forEach(({ input }) => {
        input.checked = false;
      });
    }
    updateSummary();
    onChange();
  });

  checkboxes.forEach(({ input }) => {
    input.addEventListener('change', () => {
      if (input.checked) allCheckbox.checked = false;
      updateSummary();
      onChange();
    });
  });

  details.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') details.removeAttribute('open');
  });

  return {
    element: details,
    getSelected: () =>
      checkboxes.filter(({ input }) => input.checked).map(({ category }) => category.slug),
    reset,
  };
}
