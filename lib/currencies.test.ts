/**
 * 通貨定義の正本 (lib/currencies.ts) の回帰ガード。
 *
 * ★狙いは 2 つ。
 *   1. 定義が 1 箇所に集まったことで、片方だけ直して join が静かに外れる事故を防ぐ
 *      (以前は index.tsx の 6 箇所 + dataProcessor に同じ通貨名が散っていた)
 *   2. ★EUR/JPY・CHF/JPY を「定義はするが公開しない」状態のまま固定する。
 *      公開ゲート (spec §5-2) 未達で published: true にすると、
 *      業者 5 社ぶんしかない表を本番に出すことになる。
 */
import { describe, expect, it } from 'vitest';

import {
  CURRENCIES,
  CROSS_PAIR_CODES,
  GROUP_ORDER,
  GROUP_LABELS,
  currencyDef,
  groupOf,
  labelOf,
  noteOf,
  publishedCurrencies,
} from './currencies';
import { CROSS_PAIRS, isCrossPairCode, isZeroRealValue } from './dataProcessor';

describe('定義そのもの', () => {
  it('コードが重複していない', () => {
    const codes = CURRENCIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('全通貨が色と群を持つ', () => {
    for (const c of CURRENCIES) {
      expect(c.color, c.code).toMatch(/^#[0-9a-f]{6}$/i);
      expect(GROUP_ORDER, c.code).toContain(c.group);
    }
  });

  it('GROUP_ORDER が GROUP_LABELS を網羅している', () => {
    expect([...GROUP_ORDER].sort()).toEqual(Object.keys(GROUP_LABELS).sort());
  });

  it('どの群にも公開通貨が 1 つ以上ある（空タブを作らない）', () => {
    for (const g of GROUP_ORDER) {
      expect(publishedCurrencies(g).length, g).toBeGreaterThan(0);
    }
  });
});

describe('公開ゲート待ちの 2 通貨', () => {
  // ★ここを true にするのは、公開ゲートを実測し直してからにすること。
  //   2026-09-11 時点の実測は EUR 5 社 / CHF 4 社 (必要: 6 社以上かつ 2/3 以上)。
  it.each(['EUR/JPY', 'CHF/JPY'])('%s は定義済みだが published: false', (code) => {
    const def = currencyDef(code);
    expect(def).toBeDefined();
    expect(def!.published).toBe(false);
  });

  it.each(['EUR/JPY', 'CHF/JPY'])('%s は publishedCurrencies に出てこない', (code) => {
    expect(publishedCurrencies().map((c) => c.code)).not.toContain(code);
  });

  it('CHF/JPY は符号が逆であることを注記で伝える', () => {
    expect(noteOf('CHF/JPY')).toContain('マイナス');
  });
});

describe('群の割り当て', () => {
  it('AUD/JPY は先進国通貨（新興国通貨から移した）', () => {
    expect(groupOf('AUD/JPY')).toBe('developed');
  });

  it('CHF/JPY は対円なのでクロスではない', () => {
    // ★ここが cross になると 0 の扱いが買側に付き、
    //   売 0.0 の carve-out と噛み合わなくなる。
    expect(groupOf('CHF/JPY')).toBe('developed');
    expect(isCrossPairCode('CHF/JPY')).toBe(false);
  });

  it('クロス群は 3 ペア', () => {
    expect([...CROSS_PAIR_CODES].sort()).toEqual(['CHF/TRY', 'EUR/USD', 'GBP/USD']);
  });
});

describe('dataProcessor との接続', () => {
  it('CROSS_PAIRS は正本から導出されている', () => {
    expect([...CROSS_PAIRS]).toEqual([...CROSS_PAIR_CODES]);
  });

  it('クロスペア判定が従来どおり', () => {
    for (const code of CROSS_PAIR_CODES) {
      expect(isCrossPairCode(code), code).toBe(true);
    }
    expect(isCrossPairCode('TRY/JPY')).toBe(false);
  });

  it('★0 の扱いの carve-out が導出後も生きている', () => {
    // クロスペアの買 0 は実値
    expect(isZeroRealValue('EUR/USD', 'buy')).toBe(true);
    expect(isZeroRealValue('EUR/USD', 'sell')).toBe(false);
    // CHF/JPY の売 0 は実値 (invast の方針)
    expect(isZeroRealValue('CHF/JPY', 'sell')).toBe(true);
    expect(isZeroRealValue('CHF/JPY', 'buy')).toBe(false);
    // 普通の対円通貨は 0 を実値にしない
    expect(isZeroRealValue('TRY/JPY', 'buy')).toBe(false);
    expect(isZeroRealValue('TRY/JPY', 'sell')).toBe(false);
  });
});

describe('ラベルと注記', () => {
  it('未知のコードでも落ちない（コードをそのまま返す）', () => {
    expect(labelOf('XXX/YYY')).toBe('XXX/YYY');
    expect(noteOf('XXX/YYY')).toBeUndefined();
    expect(groupOf('XXX/YYY')).toBeUndefined();
  });

  it('単位が他と違う通貨は注記を持つ', () => {
    expect(noteOf('HUF/JPY')).toContain('10万通貨');
    expect(noteOf('CHF/TRY')).toContain('円換算');
    // 単位も符号も普通の通貨は注記なし
    expect(noteOf('TRY/JPY')).toBeUndefined();
  });
});
