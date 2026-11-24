/** @file Страница каталога: загрузка товаров и компоновка частей. */

import { fetchProducts } from '../../data/api/products';
import type { Product } from '../../domain/product';
import { applyCatalog } from '../../services/catalog';
import type { CatalogFilters } from '../../services/catalog';
import { createCatalogFilters } from '../components/catalog-filters';
import { createCatalogGrid } from '../components/catalog-grid';
import { createCatalogSearch } from '../components/search-input';
import { createElement } from '../dom';

/** Создаёт страницу каталога. */
export function renderCatalogPage(): HTMLElement {
  let products: readonly Product[] = [];

  const grid = createCatalogGrid();
  const search = createCatalogSearch(() => refresh());
  const filters = createCatalogFilters(() => refresh());

  function currentFilters(): CatalogFilters {
    const values = filters.getValues();
    return {
      search: search.getValue(),
      categories: values.categories,
      minPriceCents: values.minPriceCents,
      maxPriceCents: values.maxPriceCents,
    };
  }

  function refresh(): void {
    grid.update(applyCatalog(products, currentFilters(), filters.getSort()));
  }

  fetchProducts()
    .then((loaded) => {
      products = loaded;
      const prices = loaded.map((product) => product.priceCents);
      filters.setPriceBounds(Math.min(...prices), Math.max(...prices));
      refresh();
    })
    .catch(() => grid.showMessage('Не удалось загрузить товары. Попробуйте позже.'));

  const content = createElement('div', { className: 'catalog__content' }, [
    filters.toolbar,
    grid.element,
  ]);

  return createElement('section', { className: 'page page--catalog' }, [
    createElement('h1', { className: 'page__title', text: 'Каталог' }),
    search.element,
    createElement('div', { className: 'catalog' }, [filters.element, content]),
  ]);
}
