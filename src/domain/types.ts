/** @file Доменные типы приложения. */

/** Идентификатор маршрута (страницы) приложения. */
export type AppRoute = 'home' | 'about' | 'cart';

/** Пункт навигации в шапке. */
export interface NavItem {
  /** Маршрут, на который ведёт пункт. */
  readonly route: AppRoute;
  /** Подпись ссылки. */
  readonly title: string;
}

/** Участник команды разработки. */
export interface TeamMember {
  /** Имя и фамилия. */
  readonly name: string;
  /** Логин на GitHub. */
  readonly github: string;
  /** Роль и вклад в проект. */
  readonly role: string;
}
