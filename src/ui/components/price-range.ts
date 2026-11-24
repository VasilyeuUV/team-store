/** @file Компонент диапазона цен: числовые поля и двойной ползунок. */

import { createElement } from '../dom';

/** Значения диапазона в копейках. */
export interface PriceRangeValues {
  readonly minCents: number;
  readonly maxCents: number;
}

/** Публичный интерфейс компонента. */
export interface PriceRange {
  readonly element: HTMLElement;
  getValues: () => PriceRangeValues;
  setBounds: (minCents: number, maxCents: number) => void;
  reset: () => void;
}

/**
 * Создаёт компонент выбора диапазона цен.
 * @param onChange колбэк при изменении диапазона
 * @returns элемент и методы управления
 */
export function createPriceRange(onChange: () => void): PriceRange {
  let boundMinDollars = 0;
  let boundMaxDollars = 1000;

  const minInput = createElement('input', {
    attrs: { type: 'number', placeholder: 'от', 'aria-label': 'Цена от', step: '0.01' },
  });
  const maxInput = createElement('input', {
    attrs: { type: 'number', placeholder: 'до', 'aria-label': 'Цена до', step: '0.01' },
  });

  const rangeMin = createElement('input', {
    className: 'range__input range__input--min',
    attrs: { type: 'range', 'aria-label': 'Минимальная цена', step: '1' },
  });
  const rangeMax = createElement('input', {
    className: 'range__input range__input--max',
    attrs: { type: 'range', 'aria-label': 'Максимальная цена', step: '1' },
  });
  const fill = createElement('div', { className: 'range__fill' });
  const track = createElement('div', { className: 'range__track' }, [fill, rangeMin, rangeMax]);

  const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

  const syncFill = (): void => {
    const min = Number(rangeMin.value);
    const max = Number(rangeMax.value);
    const span = boundMaxDollars - boundMinDollars || 1;
    fill.style.left = `${((min - boundMinDollars) / span) * 100}%`;
    fill.style.width = `${Math.max(0, ((max - min) / span) * 100)}%`;
  };

  const syncInputs = (): void => {
    minInput.value = String(Number(rangeMin.value));
    maxInput.value = String(Number(rangeMax.value));
  };

  rangeMin.addEventListener('input', () => {
    if (Number(rangeMin.value) > Number(rangeMax.value)) {
      rangeMin.value = rangeMax.value;
    }
    syncInputs();
    syncFill();
    onChange();
  });

  rangeMax.addEventListener('input', () => {
    if (Number(rangeMax.value) < Number(rangeMin.value)) {
      rangeMax.value = rangeMin.value;
    }
    syncInputs();
    syncFill();
    onChange();
  });

  rangeMin.addEventListener('pointerdown', () => {
    rangeMin.style.zIndex = '3';
    rangeMax.style.zIndex = '2';
  });
  rangeMax.addEventListener('pointerdown', () => {
    rangeMax.style.zIndex = '3';
    rangeMin.style.zIndex = '2';
  });

  const applyFromInputs = (): void => {
    const rawMin = minInput.value.trim() === '' ? boundMinDollars : Number(minInput.value);
    const rawMax = maxInput.value.trim() === '' ? boundMaxDollars : Number(maxInput.value);

    const min = clamp(
      Number.isFinite(rawMin) ? rawMin : boundMinDollars,
      boundMinDollars,
      boundMaxDollars,
    );
    const max = clamp(Number.isFinite(rawMax) ? rawMax : boundMaxDollars, min, boundMaxDollars);

    rangeMin.value = String(min);
    rangeMax.value = String(max);
    syncFill();
    onChange();
  };

  minInput.addEventListener('input', applyFromInputs);
  maxInput.addEventListener('input', applyFromInputs);

  const setBounds = (minCents: number, maxCents: number): void => {
    boundMinDollars = Math.floor(minCents / 100);
    boundMaxDollars = Math.max(boundMinDollars + 1, Math.ceil(maxCents / 100));

    for (const range of [rangeMin, rangeMax]) {
      range.min = String(boundMinDollars);
      range.max = String(boundMaxDollars);
    }
    for (const input of [minInput, maxInput]) {
      input.min = String(boundMinDollars);
      input.max = String(boundMaxDollars);
    }

    minInput.value = '';
    maxInput.value = '';
    rangeMin.value = String(boundMinDollars);
    rangeMax.value = String(boundMaxDollars);
    syncFill();
  };

  const reset = (): void => {
    minInput.value = '';
    maxInput.value = '';
    rangeMin.value = String(boundMinDollars);
    rangeMax.value = String(boundMaxDollars);
    syncFill();
  };

  const element = createElement('fieldset', { className: 'catalog__group' }, [
    createElement('legend', { className: 'catalog__legend', text: 'Цена' }),
    createElement('div', { className: 'catalog__price' }, [
      minInput,
      createElement('span', { text: '—' }),
      maxInput,
    ]),
    track,
  ]);

  return {
    element,
    getValues: () => {
      const minDollars =
        minInput.value.trim() === '' ? Number(rangeMin.value) : Number(minInput.value);
      const maxDollars =
        maxInput.value.trim() === '' ? Number(rangeMax.value) : Number(maxInput.value);
      return {
        minCents: Math.round((Number.isFinite(minDollars) ? minDollars : 0) * 100),
        maxCents: Math.round((Number.isFinite(maxDollars) ? maxDollars : 0) * 100),
      };
    },
    setBounds,
    reset,
  };
}
