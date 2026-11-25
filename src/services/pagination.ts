/** @file Постраничный вывод списков. */

/** Страница списка. */
export interface Page<T> {
  /** Элементы текущей страницы. */
  readonly items: readonly T[];

  /** Номер текущей страницы (начиная с 1). */
  readonly page: number;

  /** Общее количество страниц (не меньше 1). */
  readonly totalPages: number;
}

/**
 * Делит список на страницы.
 * @param items исходный список
 * @param page желаемый номер страницы (начиная с 1)
 * @param pageSize количество элементов на странице
 * @returns элементы страницы и её номер
 */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const safeSize = Math.max(1, Math.trunc(pageSize));
  const totalPages = Math.max(1, Math.ceil(items.length / safeSize));
  const safePage = Math.min(Math.max(1, Math.trunc(page)), totalPages);
  const start = (safePage - 1) * safeSize;

  return {
    items: items.slice(start, start + safeSize),
    page: safePage,
    totalPages,
  };
}
