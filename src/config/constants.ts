/** @file Общие константы приложения: название, год, курс и внешние ссылки. */

import type { Category } from '../domain/product';

/** Название магазина. */
export const APP_TITLE = 'Techno Store';

/** Ассортимент магазина (категории товаров магазина). */
export const CATEGORIES = [
  { slug: 'smartphones', label: 'Смартфоны' },
  { slug: 'laptops', label: 'Ноутбуки' },
  { slug: 'tablets', label: 'Планшеты' },
  { slug: 'mobile-accessories', label: 'Аксессуары' },
] as const satisfies readonly Category[];

/** Год создания проекта (для копирайта в подвале). */
export const COPYRIGHT_YEAR = 2026;

/** Название потока курса RS School. */
export const COURSE_NAME = 'Full-Stack JavaScript 2026 Q3';

/** Адрес сайта RS School. */
export const RS_SCHOOL_URL = 'https://rs.school/';

/** Адрес репозитория проекта. */
export const REPO_URL = 'https://github.com/VasilyeuUV/team-store';

/** Базовый адрес GitHub (профили и аватары участников). */
export const GITHUB_URL = 'https://github.com';

/** Порядок сортировки каталога. */
export const SortOrder = {
  Default: 'default',
  PriceAsc: 'price-asc',
  PriceDesc: 'price-desc',
} as const;

/** Порядок сортировки каталога. */
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
