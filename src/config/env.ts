/** @file Конфигурация окружения. */

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

/** Доступные источники данных. */
export const DATA_SOURCE = {
  api: 'api',
  mock: 'mock',
} as const;

/** Базовый адрес API (переопределяется через .env; некорректное значение игнорируется). */
export const API_BASE_URL = rawApiBaseUrl.startsWith('http')
  ? rawApiBaseUrl.replace(/\/+$/, '')
  : 'https://dummyjson.com';

/** Тип источника данных: 'api' | 'mock'. */
export type DataSource = (typeof DATA_SOURCE)[keyof typeof DATA_SOURCE];

/**
 * Определяет источник данных по значению из окружения.
 * @param value значение `VITE_DATA_SOURCE`
 * @returns `'api'` или `'mock'` (по умолчанию `'mock'`)
 */
export function resolveDataSource(value: string | undefined): DataSource {
  if (value === DATA_SOURCE.api || value === DATA_SOURCE.mock) {
    return value;
  }
  return import.meta.env.PROD ? DATA_SOURCE.api : DATA_SOURCE.mock;
}

/** Активный источник данных приложения. */
export const ACTIVE_DATA_SOURCE: DataSource = resolveDataSource(import.meta.env.VITE_DATA_SOURCE);
