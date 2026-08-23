import { describe, expect, it } from 'vitest';
import { formatTradingSpread, formatTradingSpreadParts } from './spreadDisplay';

describe('formatTradingSpread', () => {
  // 専用のスプレッド列を設けたので、見出しが「スプレッド」を担う。
  // セルには値だけを出す。
  it('未設定なら null を返す（何も描画しない）', () => {
    expect(formatTradingSpread(undefined)).toBeNull();
  });

  it('条件つき固定スプレッド', () => {
    expect(formatTradingSpread({
      mode: 'fixed', spread: 1.58, unit: '銭', condition: '1万通貨〜',
    })).toBe('1.58銭(1万通貨〜)');
  });

  it('条件なし固定スプレッドは括弧を出さない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 1.6, unit: '銭' }))
      .toBe('1.6銭');
  });

  it('pips 単位', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 0.3, unit: 'pips' }))
      .toBe('0.3pips');
  });

  it('変動スプレッド制', () => {
    expect(formatTradingSpread({ mode: 'variable' })).toBe('変動');
  });

  it('取得できていない業者は — を出す（空欄にしない）', () => {
    expect(formatTradingSpread({ mode: 'unavailable' })).toBe('—');
  });

  it('fixed なのに値が欠けていたら unavailable 扱い', () => {
    expect(formatTradingSpread({ mode: 'fixed', unit: '銭' })).toBe('—');
  });

  it('整数値でも小数第1位まで出す（各社の公表表記に合わせる）', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 2, unit: '銭' }))
      .toBe('2.0銭');
    expect(formatTradingSpread({ mode: 'fixed', spread: 1, unit: 'pips' }))
      .toBe('1.0pips');
  });

  it('小数がある値は桁を落とさない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 1.58, unit: '銭' }))
      .toBe('1.58銭');
    expect(formatTradingSpread({ mode: 'fixed', spread: 0.18, unit: '銭' }))
      .toBe('0.18銭');
  });

  it('spread が 0 でも欠損扱いしない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 0, unit: '銭' }))
      .toBe('0.0銭');
  });

  it('unit が無くても落ちない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 1.4 }))
      .toBe('1.4');
  });
});

describe('undisclosed（公式が開示していない）', () => {
  it('「非公開」と出す。変動とは区別する', () => {
    expect(formatTradingSpread({ mode: 'undisclosed' })).toBe('非公開');
    expect(formatTradingSpread({ mode: 'variable' })).toBe('変動');
  });

  it('取得失敗（—）とも区別する', () => {
    expect(formatTradingSpread({ mode: 'unavailable' })).toBe('—');
  });
});

describe('formatTradingSpreadParts（列を2行に分ける）', () => {
  it('値と条件を分けて返す', () => {
    expect(formatTradingSpreadParts({
      mode: 'fixed', spread: 1.4, unit: '銭', condition: '9-3時',
    })).toEqual({ value: '1.4銭', condition: '(9-3時)' });
  });

  it('条件が無ければ condition は undefined', () => {
    expect(formatTradingSpreadParts({ mode: 'fixed', spread: 1.6, unit: '銭' }))
      .toEqual({ value: '1.6銭', condition: undefined });
  });

  it('変動・非公開・取得失敗は値のみ', () => {
    expect(formatTradingSpreadParts({ mode: 'variable' })).toEqual({ value: '変動', condition: undefined });
    expect(formatTradingSpreadParts({ mode: 'undisclosed' })).toEqual({ value: '非公開', condition: undefined });
    expect(formatTradingSpreadParts({ mode: 'unavailable' })).toEqual({ value: '—', condition: undefined });
  });

  it('未設定は null', () => {
    expect(formatTradingSpreadParts(undefined)).toBeNull();
  });

  it('長い条件もそのまま返す（折り返しは CSS 側で行う）', () => {
    expect(formatTradingSpreadParts({
      mode: 'fixed', spread: 0.6, unit: '銭', condition: '〜1万通貨/8-3時',
    })).toEqual({ value: '0.6銭', condition: '(〜1万通貨/8-3時)' });
  });

  it('1行版は2行版を連結したものと一致する', () => {
    const s = { mode: 'fixed' as const, spread: 1.58, unit: '銭', condition: '1万通貨〜' };
    const p = formatTradingSpreadParts(s)!;
    expect(formatTradingSpread(s)).toBe(p.value + p.condition);
  });
});
