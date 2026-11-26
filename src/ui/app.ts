/** @file Каркас страницы: шапка, основная область и подвал с переключением страниц. */
import type { AppRoute } from '../config/routes';
import { getCartCount, subscribeToCart } from '../services/cart-store';
import { getCurrentRoute, initRouter, subscribeToRoute } from '../services/router';
import { createElement } from './dom';
import { createFooter } from './footer';
import { createHeader, setActiveNavLink, updateHeaderCartCount } from './header';
import { renderAboutPage } from './pages/about';
import { renderCartPage } from './pages/cart-page';
import { renderCatalogPage } from './pages/catalog-page/catalog-page';

/** Страница приложения: элемент и необязательная очистка. */
export interface Page {
  /** Корневой элемент страницы. */
  readonly element: HTMLElement;

  /** Очистка ресурсов при уходе со страницы. */
  readonly destroy?: () => void;
}

/** Результат рендера страницы: элемент или объект с очисткой. */
type PageResult = Page | HTMLElement;

const PAGE_RENDERERS: Readonly<Record<AppRoute, () => PageResult>> = {
  about: renderAboutPage,
  catalog: renderCatalogPage,
  cart: renderCartPage,
};

/**
 * Отрисовывает каркас приложения и подключает роутер.
 * @param root контейнер приложения
 */
export function renderApp(root: HTMLElement): void {
  const initialRoute = getCurrentRoute();
  const header = createHeader(initialRoute);
  const main = createElement('main', { className: 'main container' });
  const footer = createFooter();

  let destroyCurrent: (() => void) | undefined;

  const showPage = (route: AppRoute): void => {
    destroyCurrent?.();

    const result = PAGE_RENDERERS[route]();
    const element = result instanceof HTMLElement ? result : result.element;
    destroyCurrent = result instanceof HTMLElement ? undefined : result.destroy;

    main.replaceChildren(element);
    setActiveNavLink(header, route);
    window.scrollTo(0, 0);
  };

  root.replaceChildren(header, main, footer);
  showPage(initialRoute);

  subscribeToCart(() => {
    updateHeaderCartCount(header, getCartCount());
  });

  subscribeToRoute(showPage);
  initRouter();
}
