import { describe, it, expect } from 'vitest';
import {
  strengthCurrencies,
  strengthCurrencyNames,
  referenceNotes,
  REFERENCE_NOTE_COMMON,
} from './strengthCurrencies';

// 期間ごとに描かれる通貨が違う形をそのまま作る (2026-09-29 の実データは 1w=11 / 3m=6 / 1y=2)。
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
  it('どれかの期間に描かれている通貨を全部数える', () => {
    expect(strengthCurrencies(data)).toHaveLength(4);
  });

  it('参照系列 (CHF/TRY 売買) は通貨として数えない', () => {
    expect(strengthCurrencies(data)).not.toContain('CHFTRY_S');
    expect(strengthCurrencies(data)).not.toContain('CHFTRY_B');
  });

  it('短い期間にしか居ない通貨も数える (長期の 2 通貨だけにしない)', () => {
    expect(strengthCurrencies(data)).toContain('GBP');
  });

  it('和集合である (どの期間の顔ぶれとも一致しないことがある)', () => {
    // 1w に A だけ・1m に B だけ。「最も多い期間のキー」を返す実装ならここで 2 になる。
    const disjoint = {
      base: 'JPY',
      periods: { '1w': period(['JPY', 'AAA']), '1m': period(['JPY', 'BBB']) },
    };
    expect(strengthCurrencies(disjoint)).toEqual(['AAA', 'BBB', 'JPY']);
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

describe('referenceNotes (参照系列の説明)', () => {
  it('CHF/TRY だけなら CHF の説明だけで、USD の説明は出ない', () => {
    const n = referenceNotes(['CHFTRY_S', 'CHFTRY_B']).join('');
    expect(n).toContain('1万フラン');
    expect(n).not.toContain('1万ドル');
  });

  it('USDTRY_S だけなら USD の説明で、フランに触れない', () => {
    const n = referenceNotes(['USDTRY_S']).join('');
    expect(n).toContain('1万ドル');
    expect(n).not.toContain('フラン');
    expect(n).not.toContain('正反対');
  });

  it('両方あれば両方の説明が出る', () => {
    const n = referenceNotes(['CHFTRY_S', 'CHFTRY_B', 'USDTRY_S']);
    expect(n).toHaveLength(2);
    expect(n.join('')).toContain('1万フラン');
    expect(n.join('')).toContain('1万ドル');
  });

  it('参照系列が無ければ何も出ない', () => {
    expect(referenceNotes([])).toEqual([]);
  });

  it('共通部分は系列の本数を決め打ちしない', () => {
    const all = REFERENCE_NOTE_COMMON.strong + REFERENCE_NOTE_COMMON.rest;
    expect(all).not.toContain('この2本');
    expect(all).toContain('平均で割ってもいません');
  });
});
