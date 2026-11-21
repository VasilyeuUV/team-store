/** @file Общие константы приложения. */
import type { NavItem, TeamMember } from '../domain/types';

/** Название магазина. */
export const APP_TITLE = 'Techno Store';

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

/** Пункты основной навигации. */
export const NAV_ITEMS: readonly NavItem[] = [
  { route: 'home', title: 'Каталог' },
  { route: 'about', title: 'О нас' },
];

/** Участники команды и их вклад в проект. */
export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    name: 'Vlad Vasilev',
    github: 'VasilyeuUV',
    role: 'Архитектура проекта, каталог товаров, поиск и фильтрация',
  },
  {
    name: 'Vasyl Krychfalushii',
    github: 'KrychVas',
    role: 'UI-каркас и навигация, корзина, промокоды, страница «О нас» и тесты',
  },
];

/** Технологии, используемые в проекте. */
export const TECH_STACK: readonly string[] = [
  'TypeScript',
  'Vite',
  'Vitest',
  'ESLint',
  'Prettier',
  'GitHub Actions',
  'Netlify',
];
