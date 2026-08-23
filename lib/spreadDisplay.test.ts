import { describe, expect, it } from 'vitest';
import { formatTradingSpread } from './spreadDisplay';

describe('formatTradingSpread', () => {
  it('未設定なら null を返す（何も描画しない）', () => {
    expect(formatTradingSpread(undefined)).toBeNull();
  });

  it('条件つき固定スプレッド', () => {
    expect(formatTradingSpread({
      mode: 'fixed', spread: 1.58, unit: '銭', condition: '1万通貨〜',
    })).toBe('スプレッド 1.58銭(1万通貨〜)');
  });

  it('条件なし固定スプレッドは括弧を出さない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 1.6, unit: '銭' }))
      .toBe('スプレッド 1.6銭');
  });

  it('pips 単位', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 0.3, unit: 'pips' }))
      .toBe('スプレッド 0.3pips');
  });

  it('変動スプレッド制', () => {
    expect(formatTradingSpread({ mode: 'variable' })).toBe('スプレッド 変動');
  });

  it('取得できていない業者は — を出す（空欄にしない）', () => {
    expect(formatTradingSpread({ mode: 'unavailable' })).toBe('スプレッド —');
  });

  it('fixed なのに値が欠けていたら unavailable 扱い', () => {
    expect(formatTradingSpread({ mode: 'fixed', unit: '銭' })).toBe('スプレッド —');
  });

  it('整数値でも小数第1位まで出す（各社の公表表記に合わせる）', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 2, unit: '銭' }))
      .toBe('スプレッド 2.0銭');
    expect(formatTradingSpread({ mode: 'fixed', spread: 1, unit: 'pips' }))
      .toBe('スプレッド 1.0pips');
  });

  it('小数がある値は桁を落とさない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 1.58, unit: '銭' }))
      .toBe('スプレッド 1.58銭');
    expect(formatTradingSpread({ mode: 'fixed', spread: 0.18, unit: '銭' }))
      .toBe('スプレッド 0.18銭');
  });

  it('spread が 0 でも欠損扱いしない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 0, unit: '銭' }))
      .toBe('スプレッド 0.0銭');
  });

  it('unit が無くても落ちない', () => {
    expect(formatTradingSpread({ mode: 'fixed', spread: 1.4 }))
      .toBe('スプレッド 1.4');
  });
});

describe('undisclosed（公式が開示していない）', () => {
  it('「非公開」と出す。変動とは区別する', () => {
    expect(formatTradingSpread({ mode: 'undisclosed' })).toBe('スプレッド 非公開');
    expect(formatTradingSpread({ mode: 'variable' })).toBe('スプレッド 変動');
  });

  it('取得失敗（—）とも区別する', () => {
    expect(formatTradingSpread({ mode: 'unavailable' })).toBe('スプレッド —');
  });
});
