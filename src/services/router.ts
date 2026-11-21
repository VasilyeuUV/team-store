/** @file Хэш-роутер приложения: разбор адреса, переходы и подписка на смену страницы. */
import type { AppRoute } from '../domain/types';

/** Колбэк, вызываемый при смене маршрута. */
export type RouteListener = (route: AppRoute) => void;

/** Соответствие маршрута и его хэша в адресной строке. */
export const ROUTE_HASHES: Readonly<Record<AppRoute, string>> = {
  home: '#/',
  about: '#/about',
  cart: '#/cart',
};

const listeners = new Set<RouteListener>();
let isInitialized = false;

/**
 * Преобразует хэш адресной строки в маршрут.
 * Неизвестные и пустые адреса ведут на главную.
 * @param hash значение `location.hash`
 * @returns маршрут приложения
 */
export function parseRoute(hash: string): AppRoute {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '').toLowerCase();
  const found = (Object.keys(ROUTE_HASHES) as AppRoute[]).find(
    (route) => ROUTE_HASHES[route] === `#/${path}`,
  );
  return found ?? 'home';
}

/**
 * Возвращает хэш для маршрута.
 * @param route маршрут приложения
 * @returns строка вида `#/about`
 */
export function getRouteHash(route: AppRoute): string {
  return ROUTE_HASHES[route];
}

/**
 * Возвращает текущий маршрут по адресной строке.
 * @returns активный маршрут
 */
export function getCurrentRoute(): AppRoute {
  return parseRoute(window.location.hash);
}

/**
 * Программно переходит на указанный маршрут.
 * @param route целевой маршрут
 */
export function navigateTo(route: AppRoute): void {
  window.location.hash = getRouteHash(route);
}

/**
 * Подписывает на смену маршрута.
 * @param listener обработчик нового маршрута
 * @returns функция отписки
 */
export function subscribeToRoute(listener: RouteListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Запускает отслеживание `hashchange` (повторный вызов игнорируется). */
export function initRouter(): void {
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  window.addEventListener('hashchange', () => {
    const route = getCurrentRoute();
    listeners.forEach((listener) => listener(route));
  });
}
