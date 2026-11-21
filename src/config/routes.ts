/** @file Маршруты приложения и их хэши в адресной строке. */

/** Идентификатор маршрута (страницы) приложения. */
export type AppRoute = 'home' | 'about' | 'cart';

/** Соответствие маршрута и его хэша в адресной строке. */
export const ROUTE_HASHES: Readonly<Record<AppRoute, string>> = {
  home: '#/',
  about: '#/about',
  cart: '#/cart',
};
