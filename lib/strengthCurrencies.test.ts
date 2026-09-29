import { describe, it, expect } from 'vitest';
import { strengthCurrencies, strengthCurrencyNames } from './strengthCurrencies';

// 期間ごとに描かれる通貨が違う形をそのまま作る (実データも 1w=11 / 3m=6 / 1y=2)。
const period = (codes: string[], references: string[] = []) => ({
  series: Object.fromEntries([...codes, ...references].map((c) => [c, [1]])),
  references,
});

const data = {
  base: 'JPY',
  periods: {
    '1w': period(['JPY', 'USD', 'TRY', 'GBP'], ['CHFTRY_S', 'CHFTRY_B']),
    '1y': period(['JPY', 'TRY']),
  },
};

describe('strengthCurrencies', () => {
  it('どれかの期間に描かれている通貨を全部数える (最も多い期間の母集団)', () => {
    expect(strengthCurrencies(data)).toHaveLength(4);
  });

  it('参照系列 (CHF/TRY 売買) は通貨として数えない', () => {
    expect(strengthCurrencies(data)).not.toContain('CHFTRY_S');
    expect(strengthCurrencies(data)).not.toContain('CHFTRY_B');
  });

  it('短い期間にしか居ない通貨も数える (長期の 2 通貨だけにしない)', () => {
    expect(strengthCurrencies(data)).toContain('GBP');
  });

  it('基準通貨 (円) は最後に置く', () => {
    expect(strengthCurrencies(data).at(-1)).toBe('JPY');
  });
});

describe('strengthCurrencyNames', () => {
  it('日本語名にする。表に無いコードはコードのまま', () => {
    expect(strengthCurrencyNames(['USD', 'GBP', 'XYZ', 'JPY'])).toEqual(
      ['米ドル', '英ポンド', 'XYZ', '日本円'],
    );
  });
});
