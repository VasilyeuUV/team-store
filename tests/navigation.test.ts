/** @file Тесты пунктов навигации (config/navigation). */
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '../src/config/navigation';
import { ROUTE_HASHES } from '../src/config/routes';

describe('NAV_ITEMS', () => {
  it('содержит каталог и страницу «О нас» без дублей', () => {
    const routes = NAV_ITEMS.map((item) => item.route);
    expect(routes).toEqual(['catalog', 'about']);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('каждый пункт ведёт на существующий маршрут и имеет подпись', () => {
    NAV_ITEMS.forEach((item) => {
      expect(ROUTE_HASHES[item.route]).toBeDefined();
      expect(item.title.length).toBeGreaterThan(0);
    });
  });
});
