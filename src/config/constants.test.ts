/** @file Тесты констант навигации и команды. */
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, TEAM_MEMBERS } from './constants';

describe('NAV_ITEMS', () => {
  it('содержит каталог и страницу «О нас» без дублей', () => {
    const routes = NAV_ITEMS.map((item) => item.route);
    expect(routes).toEqual(['home', 'about']);
    expect(new Set(routes).size).toBe(routes.length);
  });
});

describe('TEAM_MEMBERS', () => {
  it('содержит реальных участников с логинами GitHub и ролями', () => {
    expect(TEAM_MEMBERS.map((member) => member.github)).toEqual(['VasilyeuUV', 'KrychVas']);
    TEAM_MEMBERS.forEach((member) => {
      expect(member.name.length).toBeGreaterThan(0);
      expect(member.role.length).toBeGreaterThan(0);
    });
  });
});
