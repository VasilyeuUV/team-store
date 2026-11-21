/** @file Команда проекта и стек технологий (подвал и страница «О нас»). */

/** Участник команды разработки. */
export interface TeamMember {
  /** Имя и фамилия. */
  readonly name: string;
  /** Логин на GitHub. */
  readonly github: string;
  /** Роль и вклад в проект. */
  readonly role: string;
}

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

/** Технологии, используемые командой в проекте. */
export const TECH_STACK: readonly string[] = [
  'TypeScript',
  'Vite',
  'Vitest',
  'ESLint',
  'Prettier',
  'GitHub Actions',
  'Netlify',
];
