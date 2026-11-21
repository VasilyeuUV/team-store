/** @file Тесты таблицы маршрутов (config/routes). */
import { describe, expect, it } from 'vitest';
import { ROUTE_HASHES } from '../src/config/routes';

describe('ROUTE_HASHES', () => {
  it('все хэши начинаются с «#/»', () => {
    Object.values(ROUTE_HASHES).forEach((hash) => {
      expect(hash.startsWith('#/')).toBe(true);
    });
  });

  it('хэши маршрутов не повторяются', () => {
    const hashes = Object.values(ROUTE_HASHES);
    expect(new Set(hashes).size).toBe(hashes.length);
  });

  it('главная страница соответствует корню', () => {
    expect(ROUTE_HASHES.home).toBe('#/');
  });
});
