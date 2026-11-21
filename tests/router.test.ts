/** @file Тесты хэш-роутера (services/router). */
import { describe, expect, it } from 'vitest';
import { getRouteHash, parseRoute } from '../src/services/router';

describe('parseRoute', () => {
  it('пустой хэш и корень ведут на главную', () => {
    expect(parseRoute('')).toBe('home');
    expect(parseRoute('#')).toBe('home');
    expect(parseRoute('#/')).toBe('home');
  });

  it('распознаёт известные маршруты', () => {
    expect(parseRoute('#/about')).toBe('about');
    expect(parseRoute('#/cart')).toBe('cart');
  });

  it('терпим к регистру, отсутствию слэша и хвостовому слэшу', () => {
    expect(parseRoute('#about')).toBe('about');
    expect(parseRoute('#/About/')).toBe('about');
  });

  it('неизвестный маршрут ведёт на главную', () => {
    expect(parseRoute('#/unknown')).toBe('home');
  });
});

describe('getRouteHash', () => {
  it('хэш маршрута разбирается обратно в тот же маршрут', () => {
    expect(parseRoute(getRouteHash('home'))).toBe('home');
    expect(parseRoute(getRouteHash('about'))).toBe('about');
    expect(parseRoute(getRouteHash('cart'))).toBe('cart');
  });
});
