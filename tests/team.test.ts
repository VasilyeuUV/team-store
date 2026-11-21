/** @file Тесты данных команды (config/team). */
import { describe, expect, it } from 'vitest';
import { TEAM_MEMBERS, TECH_STACK } from '../src/config/team';

describe('TEAM_MEMBERS', () => {
  it('содержит реальных участников с логинами GitHub и ролями', () => {
    expect(TEAM_MEMBERS.map((member) => member.github)).toEqual(['VasilyeuUV', 'KrychVas']);
    TEAM_MEMBERS.forEach((member) => {
      expect(member.name.length).toBeGreaterThan(0);
      expect(member.role.length).toBeGreaterThan(0);
    });
  });
});

describe('TECH_STACK', () => {
  it('не пустой и без повторов', () => {
    expect(TECH_STACK.length).toBeGreaterThan(0);
    expect(new Set(TECH_STACK).size).toBe(TECH_STACK.length);
  });
});
