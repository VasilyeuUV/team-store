/** @file Шапка страницы: логотип, навигация и ссылка на корзину. */
import type { AppRoute } from '../config/routes';
import { APP_TITLE } from '../config/constants';
import { NAV_ITEMS } from '../config/navigation';
import { getRouteHash } from '../services/router';
import { createElement } from './dom';

const ACTIVE_CLASS = 'is-active';

/**
 * Создаёт шапку страницы.
 * @param activeRoute текущий маршрут для подсветки пункта меню
 * @returns элемент `<header>`
 */
export function createHeader(activeRoute: AppRoute): HTMLElement {
  const logo = createElement('a', {
    className: 'header__logo',
    text: APP_TITLE,
    attrs: { href: getRouteHash('home') },
  });

  const navList = createElement(
    'ul',
    { className: 'nav__list' },
    NAV_ITEMS.map((item) =>
      createElement('li', { className: 'nav__item' }, [
        createElement('a', {
          className: 'nav__link',
          text: item.title,
          attrs: { href: getRouteHash(item.route), 'data-route': item.route },
        }),
      ]),
    ),
  );
  const nav = createElement(
    'nav',
    { className: 'nav', attrs: { 'aria-label': 'Основная навигация' } },
    [navList],
  );

  const cartLink = createElement('a', {
    className: 'nav__link header__cart',
    text: 'Корзина',
    attrs: { href: getRouteHash('cart'), 'data-route': 'cart' },
  });

  const header = createElement('header', { className: 'header' }, [
    createElement('div', { className: 'container header__inner' }, [logo, nav, cartLink]),
  ]);

  setActiveNavLink(header, activeRoute);
  return header;
}

/**
 * Подсвечивает ссылку активного маршрута в шапке.
 * @param header элемент шапки, созданный `createHeader`
 * @param route активный маршрут
 */
export function setActiveNavLink(header: HTMLElement, route: AppRoute): void {
  header.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle(ACTIVE_CLASS, isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
