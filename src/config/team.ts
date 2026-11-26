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
    role: 'Архитектура (domain/services/data/ui), данные DummyJSON и mock, каталог: сервисы фильтрации/сортировки/пагинации (TDD), страница каталога, комбобокс категорий, двойной ползунок цены, кэш и отмена запросов, инфраструктура (ESLint/Prettier/husky, CI, Netlify), документация',
  },
  {
    name: 'Vasyl Krychfalushii',
    github: 'KrychVas',
    role: 'UI-каркас и навигация, страница «О нас», корзина: логика расчётов, промокод SALE10, localStorage, страница корзины, счётчик в шапке, тесты',
  },
];

/** Технологии, используемые командой в проекте. */
export const TECH_STACK: readonly string[] = [
  'TypeScript',
  'Vite (vanilla)',
  'Vitest',
  'ESLint',
  'Prettier',
  'husky + lint-staged',
  'GitHub Actions',
  'Netlify',
];
