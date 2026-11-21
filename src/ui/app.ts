/** @file Каркас страницы: шапка, основная область и подвал с переключением страниц. */
import type { AppRoute } from '../config/routes';
import { getCurrentRoute, initRouter, subscribeToRoute } from '../services/router';
import { createElement } from './dom';
import { createFooter } from './footer';
import { createHeader, setActiveNavLink } from './header';
import { renderAboutPage } from './pages/about';
import { renderCartPage } from './pages/cart';
import { renderHomePage } from './pages/home';

const PAGE_RENDERERS: Readonly<Record<AppRoute, () => HTMLElement>> = {
  home: renderHomePage,
  about: renderAboutPage,
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

  const showPage = (route: AppRoute): void => {
    main.replaceChildren(PAGE_RENDERERS[route]());
    setActiveNavLink(header, route);
    window.scrollTo(0, 0);
  };

  root.replaceChildren(header, main, footer);
  showPage(initialRoute);

  subscribeToRoute(showPage);
  initRouter();
}
