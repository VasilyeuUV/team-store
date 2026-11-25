/** @file Тесты постраничного вывода. */
import { describe, expect, it } from 'vitest';
import { paginate } from '../src/services/pagination';

const numbers = Array.from({ length: 25 }, (_, index) => index + 1);

describe(paginate.name, () => {
  it('возвращает первую страницу и общее число страниц', () => {
    expect(paginate(numbers, 1, 10)).toEqual({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      page: 1,
      totalPages: 3,
    });
  });

  it('возвращает последнюю неполную страницу', () => {
    expect(paginate(numbers, 3, 10)).toEqual({
      items: [21, 22, 23, 24, 25],
      page: 3,
      totalPages: 3,
    });
  });

  it('приводит слишком большой номер страницы к последней', () => {
    expect(paginate(numbers, 99, 10).page).toBe(3);
  });

  it('приводит номер страницы меньше 1 к первой', () => {
    expect(paginate(numbers, 0, 10).page).toBe(1);
  });

  it('возвращает одну пустую страницу для пустого списка', () => {
    expect(paginate([], 1, 10)).toEqual({ items: [], page: 1, totalPages: 1 });
  });

  it('не мутирует исходный массив', () => {
    const source = [1, 2, 3, 4];

    paginate(source, 1, 2);

    expect(source).toEqual([1, 2, 3, 4]);
  });
});
