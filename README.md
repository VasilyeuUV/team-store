# team-store

Учебный командный проект курса RSSchool (fullstack-engineering):
**Интернет-магазин электроники**.

## О проекте

- **Что делает:** каталог гаджетов (смартфоны, ноутбуки, планшеты, аксессуары)
  с поиском, фильтрами по категории и цене, сортировкой; корзина с изменением
  количества и промокодом `SALE10` (−10%).
- **Данные:** публичный API DummyJSON; при недоступности сети — локальный снапшот.
- **Срок сдачи:** 01.12.2026.
- **Задание:** https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/team-project-interview/README.md

## Команда

| Участник            | GitHub                                       | Вклад                                                              |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| Vlad Vasilev        | [@VasilyeuUV](https://github.com/VasilyeuUV) | архитектура проекта, каталог товаров, поиск и фильтрация           |
| Vasyl Krychfalushii | [@KrychVas](https://github.com/KrychVas)     | UI-каркас и навигация, корзина, промокоды, страница «О нас», тесты |

## Стек

TypeScript · Vite (vanilla) · Vitest · ESLint · Prettier · husky + lint-staged ·
GitHub Actions · Netlify.

## Ветки и защита

| Ветка                 | Назначение         | PR куда               | Ревью     | Мерж                    |
| --------------------- | ------------------ | --------------------- | --------- | ----------------------- |
| `main`                | продакшен (деплой) | `develop → main`      | 1 approve | владелец                |
| `develop`             | интеграция         | `feature/* → develop` | 1 approve | автор после approve     |
| `feature/*`           | задача             | → `develop`           | 1 approve | автор после approve     |
| `submissions/<login>` | сдача              | → `main`              | —         | не мержится до проверки |

- Новые ветки создаём **от `develop`**. `main` напрямую не трогаем.
- `main` и `develop` защищены: только через PR + 1 approve + зелёный CI.

## Коммиты

Conventional Commits на английском: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`. В скобках можно указать название блока, к которому относится коммит.
Тип — латиницей, описание — по-английски с указанием в скобках номера задачи в формате (#1).

Пример: `feat: add a price filter (#3)`

## Стиль кода и документация

Проверка — `npm run lint` (ESLint + JSDoc). Форматирование — Prettier,
в VS Code применяется при сохранении (`.vscode/settings.json`).

### Шапка файла

Каждый модуль в `src/` начинается с комментария `@file` (самый первый в файле):

```ts
/**
 * @file Модуль фильтрации и сортировки каталога.
 */
```

### Документирование публичного API

Экспортируемые функции, типы, интерфейсы и константы — с JSDoc.
В TypeScript **типы в `@param`/`@returns` не дублируют**:

```ts
/** Промокоды: код → скидка в долях. */
export const PROMO_CODES: Readonly<Record<string, number>> = { SALE10: 0.1 };

/**
 * Считает сумму корзины, скидку и итог.
 * @param lines строки: цена и количество
 * @param promoCode промокод (необязателен)
 * @returns суммы до скидки, скидка и итог
 */
export function calcCart(lines: CartLine[], promoCode?: string): CartTotals {
  // ...
}
```

### Импорт типов

```ts
import type { Product } from './types'; // только типы
import { filterProducts } from './filters'; // значения
```

### Именование

| Что                 | Стиль                     | Пример             |
| ------------------- | ------------------------- | ------------------ |
| переменные, функции | `camelCase`               | `filteredProducts` |
| типы, интерфейсы    | `PascalCase`              | `CartItem`         |
| константы-значения  | `UPPER_SNAKE_CASE`        | `PROMO_CODES`      |
| boolean             | `is`/`has` + `PascalCase` | `isLoading`        |

### Общие правила

- `===` / `!==` вместо `==` / `!=`;
- `const` вместо `let`, если значение не меняется;
- не использовать `any` без необходимости (лучше `unknown` или дженерик);
- комментарии и JSDoc — на русском;
- отступы/кавычки — только через Prettier.

## Pull Request

- Base: `develop` (задачи) или `main` (релиз).
- В описании: что сделано, как проверить, `Closes #N`.
- Обязательное ревью напарника (1 approve).
- После мержа ветку задачи удаляем.

## Доска задач

GitHub Projects, колонки: **Todo → In Progress → In Review → Done**.

Цикл:

1. Issue → добавить в проект.
2. Назначить ответственного исполнителя, статус **In Progress**.
3. Ветка `feature/<номер>-<кратко>` от `develop`.
4. PR в `develop` → статус **In Review**.
5. Approve → merge → **Done** (или автоматически по `Closes #N`).

## Definition of Done

- Задача заведена как Issue и добавлена в проект.
- Ветка `feature/*` создана от `develop`.
- PR в `develop` с `Closes #N`, 1 approve, CI зелёный.
- Карточка переведена в **Done**, ветка удалена.

## Документация

Язык документации и комментариев в коде — **русский**.

## Как работаем

- Канал связи: Discord.
- Встречи: по предварительному согласованию.
- Если кто-то задерживается: написать в чат и продолжить по плану.
- Ревью: отвечать в течение (уточнить) часов.

## Структура проекта

```
src/
  main.ts            # точка входа: подключает стили и запускает UI
  assets/
    icons/
      github.svg     # иконка GitHub (16×16, fill="currentColor")
  config/
    constants.ts     # общие константы: название, год, курс, внешние ссылки
    routes.ts        # AppRoute и ROUTE_HASHES (#/, #/about, #/cart)
    navigation.ts    # NavItem и NAV_ITEMS — пункты меню в шапке
    team.ts          # TeamMember, TEAM_MEMBERS и TECH_STACK
  domain/
    types.ts         # типы предметной области (товары, корзина) — пока пусто
  services/
    router.ts        # хэш-роутер: разбор адреса, переходы, подписка
  data/              # источники данных: dev / fakeAPI (пока пусто)
  ui/
    app.ts           # каркас: header + main + footer, смена страниц по роутеру
    dom.ts           # хелперы создания DOM-элементов
    icons.ts         # создание SVG-иконок из assets/icons и ссылок с иконками
    header.ts        # шапка: логотип, навигация, ссылка на корзину
    footer.ts        # подвал: команда, год, репозиторий, RS School
    pages/
      home.ts        # главная (заглушка каталога)
      about.ts       # «О нас»: о магазине, стек, карточки команды
      cart.ts        # корзина (заглушка)
  styles/
    reset.css        # нормализация
    main.css         # базовые стили, каркас, адаптив
tests/
  router.test.ts     # services/router
  routes.test.ts     # config/routes
  navigation.test.ts # config/navigation
  team.test.ts       # config/team
```

- `index.html` — оболочка: контейнер `#app` + подключение `src/main.ts`.
- `public/` — статика «как есть» (favicon).

### Договорённости

**Слои и зависимости**

- `domain/` — только типы предметной области магазина (товары, корзина и т.п.).
  Слой ни от чего не зависит: не импортирует `config/`, `services/`, `ui/`.
- `config/` — статические настройки, разнесённые по смыслу: маршруты
  (`routes.ts`), навигация (`navigation.ts`), команда (`team.ts`), общие
  константы (`constants.ts`). Тип хранится рядом с константой, которую он
  описывает. Не складываем всё в один файл.
- `services/` — логика без разметки (роутер, далее — каталог, корзина).
  Использует `config/` и `domain/`.
- `ui/` — компоненты и страницы. Обращается к данным только через
  `services/`, напрямую в `data/` не ходит.
- Маршрутизация — через hash (`#/about`), поэтому работает на Netlify без
  настройки редиректов.

**SVG-иконки**

- Каждая иконка — отдельный файл в `src/assets/icons/`, монохромный,
  с `fill="currentColor"` (цвет наследуется от текста) и `aria-hidden="true"`.
- Подключение — импортом с суффиксом `?raw` (типы даёт `vite/client`)
  и созданием элемента через хелпер в `src/ui/icons.ts`. SVG-код в TS не пишем.
- Аватары команды подгружаются с GitHub (`https://github.com/<login>.png`),
  локальные изображения в репозитории не хранятся.

**Тесты**

- Unit-тесты лежат в папке `tests/` в корне репозитория, по одному файлу
  на логический модуль: `tests/<модуль>.test.ts` (например, `router.test.ts`
  для `src/services/router.ts`).
- Импорты — относительные от `tests/`: `../src/services/router`.
- Запуск — `npm test` (Vitest находит файлы `*.test.ts` автоматически).

## Запуск

Требования: Node.js 20+ (рекомендуется 22), npm.

```bash
npm install      # установка зависимостей
npm run dev      # dev-сервер с HMR
npm run build    # типизация + продакшен-сборка в dist/
npm run preview  # локальный просмотр собранного dist/
npm test         # unit-тесты (Vitest)
npm run lint     # ESLint
npm run format   # Prettier
```

### Как проверить, что каркас работает

1. Выполни `npm run dev` и открой адрес из консоли.
2. На странице должны появиться шапка с навигацией, приветствие
   **«Добро пожаловать в Techno Store!»** и подвал — значит, точка входа и
   рендер работают. Ссылка «О нас» открывает страницу команды (`#/about`).
3. `npm run build` + `npm run preview` — собранная версия открывается так же.

## Деплой

Хостинг — **Netlify**. Настройки в `netlify.toml`:
сборка `npm run build`, публикуемая папка `dist`, Node 22.

- **Production:** ветка `main` → основной адрес сайта.
- **Deploy Preview:** на каждый PR Netlify собирает предпросмотр и присылает
  ссылку в PR — так проверяем изменения до мержа.

Перед сдачей: открыть ссылку в инкогнито и убедиться, что сайт работает.

- **Сайт:** https://team-store-tsub.netlify.app/

## Ссылки

- Репозиторий: https://github.com/VasilyeuUV/team-store
- Доска: https://github.com/users/VasilyeuUV/projects/1
- Деплой: https://team-store-tsub.netlify.app/
