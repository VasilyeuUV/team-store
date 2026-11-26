/** @file Unit-тесты форматирования денежных сумм в UI. */

import { describe, expect, it } from 'vitest';
import { formatPriceCents } from '../src/ui/format';

describe('formatPriceCents', () => {
  it('форматирует суммы в целых копейках в строку с валютой', () => {
    expect(formatPriceCents(0)).toBe('$0.00');
    expect(formatPriceCents(59999)).toBe('$599.99');
    expect(formatPriceCents(105)).toBe('$1.05');
  });

  it('безопасно обрабатывает некорректные числовые значения', () => {
    expect(formatPriceCents(Number.NaN)).toBe('$0.00');
  });
});
