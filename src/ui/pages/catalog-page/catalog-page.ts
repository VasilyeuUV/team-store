/** @file Страница каталога: загрузка, фильтры, сортировка и постраничный вывод. */

import { CATALOG_PAGE_SIZE } from '../../../config/constants';
import type { Product } from '../../../domain/product';
import type { CatalogFilters } from '../../../services/catalog';
import { fetchProducts } from '../../../data/api/products';
import { applyCatalog } from '../../../services/catalog';
import { paginate } from '../../../services/pagination';
import { createCatalogFilters } from '../../components/catalog-filters/catalog-filters';
import { createCatalogGrid } from '../../components/catalog-grid/catalog-grid';
import { createCatalogSearch } from '../../components/search-input/search-input';
import { createElement } from '../../dom';
import './catalog-page.css';

/** Задержка дебаунса поиска, мс. */
const SEARCH_DEBOUNCE_MS = 300;

/** Результат отрисовки страницы каталога. */
export interface CatalogPage {
  /** Корневой элемент страницы. */
  readonly element: HTMLElement;

  /** Отменяет незавершённую загрузку. */
  readonly destroy: () => void;
}

/** Создаёт страницу каталога. */
export function renderCatalogPage(): CatalogPage {
  let products: readonly Product[] = [];
  let page = 1;
  let debounceTimer: number | undefined;

  const controller = new AbortController();

  const grid = createCatalogGrid();
  const pager = createElement('nav', {
    className: 'catalog__pager',
    attrs: { 'aria-label': 'Страницы каталога' },
  });

  const search = createCatalogSearch(() => {
    page = 1;
    scheduleRefresh();
  });

  const filters = createCatalogFilters(() => {
    page = 1;
    refresh();
  });

  function currentFilters(): CatalogFilters {
    const values = filters.getValues();
    return {
      search: search.getValue(),
      categories: values.categories,
      minPriceCents: values.minPriceCents,
      maxPriceCents: values.maxPriceCents,
    };
  }

  function renderPager(current: number, total: number): void {
    pager.replaceChildren();

    if (total <= 1) {
      return;
    }

    const prevButton = createElement('button', {
      className: 'btn',
      text: 'Назад',
      attrs: { type: 'button' },
    });
    prevButton.disabled = current <= 1;
    prevButton.addEventListener('click', () => {
      page = current - 1;
      refresh();
    });

    const nextButton = createElement('button', {
      className: 'btn',
      text: 'Вперёд',
      attrs: { type: 'button' },
    });
    nextButton.disabled = current >= total;
    nextButton.addEventListener('click', () => {
      page = current + 1;
      refresh();
    });

    pager.append(
      prevButton,
      createElement('span', {
        className: 'catalog__page-info',
        text: `Страница ${current} из ${total}`,
      }),
      nextButton,
    );
  }

  function refresh(): void {
    const pageData = paginate(
      applyCatalog(products, currentFilters(), filters.getSort()),
      page,
      CATALOG_PAGE_SIZE,
    );

    page = pageData.page;
    grid.update(pageData.items);
    renderPager(pageData.page, pageData.totalPages);
  }

  function scheduleRefresh(): void {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(refresh, SEARCH_DEBOUNCE_MS);
  }

  fetchProducts(undefined, controller.signal)
    .then((loaded) => {
      if (!grid.element.isConnected) {
        return;
      }

      products = loaded;
      const prices = loaded.map((product) => product.priceCents);
      filters.setPriceBounds(Math.min(...prices), Math.max(...prices));
      refresh();
    })
    .catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      console.error('Не удалось загрузить товары', error);
      grid.showMessage('Не удалось загрузить товары. Попробуйте позже.');
    });

  const content = createElement('div', { className: 'catalog__content' }, [
    filters.toolbar,
    grid.element,
    pager,
  ]);

  return {
    element: createElement('section', { className: 'page page--catalog' }, [
      createElement('h1', { className: 'page__title', text: 'Каталог' }),
      search.element,
      createElement('div', { className: 'catalog' }, [filters.element, content]),
    ]),
    destroy: () => {
      window.clearTimeout(debounceTimer);
      controller.abort();
    },
  };
}
