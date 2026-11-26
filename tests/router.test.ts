/** @file Тесты хэш-роутера (services/router). */
import { describe, expect, it } from 'vitest';
import { getRouteHash, parseRoute } from '../src/services/router';

describe('parseRoute', () => {
  it('пустой хэш и корень ведут на «О нас»', () => {
    expect(parseRoute('')).toBe('about');
    expect(parseRoute('#')).toBe('about');
    expect(parseRoute('#/')).toBe('about');
  });

  it('распознаёт известные маршруты', () => {
    expect(parseRoute('#/catalog')).toBe('catalog');
    expect(parseRoute('#/cart')).toBe('cart');
  });

  it('терпим к регистру, отсутствию слэша и хвостовому слэшу', () => {
    expect(parseRoute('#catalog')).toBe('catalog');
    expect(parseRoute('#/Catalog/')).toBe('catalog');
  });

  it('неизвестный маршрут ведёт на «О нас»', () => {
    expect(parseRoute('#/unknown')).toBe('about');
  });
});

describe('getRouteHash', () => {
  it('хэш маршрута разбирается обратно в тот же маршрут', () => {
    expect(parseRoute(getRouteHash('about'))).toBe('about');
    expect(parseRoute(getRouteHash('catalog'))).toBe('catalog');
    expect(parseRoute(getRouteHash('cart'))).toBe('cart');
  });
});
