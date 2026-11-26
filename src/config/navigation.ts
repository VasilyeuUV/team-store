/** @file Пункты основной навигации в шапке. */
import type { AppRoute } from './routes';

/** Пункт навигации в шапке. */
export interface NavItem {
  /** Маршрут, на который ведёт пункт. */
  readonly route: AppRoute;
  /** Подпись ссылки. */
  readonly title: string;
}

/** Пункты основной навигации. */
export const NAV_ITEMS: readonly NavItem[] = [
  { route: 'catalog', title: 'Каталог' },
  { route: 'about', title: 'О нас' },
];
