/**
 * 通貨定義の正本 (lib/currencies.ts) の回帰ガード。
 *
 * ★狙いは 2 つ。
 *   1. 定義が 1 箇所に集まったことで、片方だけ直して join が静かに外れる事故を防ぐ
 *      (以前は index.tsx の 6 箇所 + dataProcessor に同じ通貨名が散っていた)
 *   2. ★12 通貨すべてが公開状態であることを固定する。
 *      EUR/JPY・CHF/JPY は 2026-09-11 に掲載条件を満たして公開した
 *      (EUR 11 社中 9 社 / CHF 7 社中 6 社 が 14 日窓に 7 日以上)。
 */
import { describe, expect, it } from 'vitest';

import {
  CURRENCIES,
  masterHistoryPath,
  providersConfigPath,
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

describe('公開状態', () => {
  it.each(['EUR/JPY', 'CHF/JPY'])('%s は公開されている', (code) => {
    const def = currencyDef(code);
    expect(def).toBeDefined();
    expect(def!.published).toBe(true);
  });

  it('12 通貨すべてがタブに出る', () => {
    expect(publishedCurrencies().length).toBe(CURRENCIES.length);
  });

  it('先進国群は 4 通貨', () => {
    expect(publishedCurrencies('developed').map((c) => c.code)).toEqual([
      'USD/JPY', 'AUD/JPY', 'EUR/JPY', 'CHF/JPY',
    ]);
  });

  it('CHF/JPY は符号が逆であることを注記で伝える', () => {
    // ★買が全社マイナスの通貨はこれだけ。注記を落とすと
    //   「マイナスだから取得失敗」と読まれる。
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

describe('★public 配下のファイルパス', () => {
  // ★以前は useSwapData.ts に通貨ごとの三項演算子の梯子があり、
  //   書き忘れると既定の TRY にフォールバックしていた。
  //   「タブのラベルは EUR なのに中身は TRY」という、画面上は
  //   正常に見える取り違えになる (2026-09-11 のレビューで指摘された)。
  //   下の表は梯子が出していた値そのもの。1 つでもずれたら鳴る。
  const OLD_LADDER: Array<[string, string, string]> = [
    ['TRY/JPY', '/providers_config.json', '/data/master_history_try.csv'],
    ['MXN/JPY', '/providers_config_mxn.json', '/data/master_history_mxn.csv'],
    ['USD/JPY', '/providers_config_usd.json', '/data/master_history_usd.csv'],
    ['EUR/USD', '/providers_config_eurusd.json', '/data/master_history_eurusd.csv'],
    ['GBP/USD', '/providers_config_gbpusd.json', '/data/master_history_gbpusd.csv'],
    ['HUF/JPY', '/providers_config_huf.json', '/data/master_history_huf.csv'],
    ['ZAR/JPY', '/providers_config_zar.json', '/data/master_history_zar.csv'],
    ['PLN/JPY', '/providers_config_pln.json', '/data/master_history_pln.csv'],
    ['AUD/JPY', '/providers_config_aud.json', '/data/master_history_aud.csv'],
    ['CHF/TRY', '/providers_config_chftry.json', '/data/master_history_chftry.csv'],
  ];

  it.each(OLD_LADDER)('%s は従来と同じパスを指す', (code, cfg, hist) => {
    expect(providersConfigPath(code)).toBe(cfg);
    expect(masterHistoryPath(code)).toBe(hist);
  });

  it('★EUR/JPY と CHF/JPY は自分のファイルを指す (TRY に落ちない)', () => {
    expect(masterHistoryPath('EUR/JPY')).toBe('/data/master_history_eur.csv');
    expect(masterHistoryPath('CHF/JPY')).toBe('/data/master_history_chf.csv');
    expect(providersConfigPath('EUR/JPY')).toBe('/providers_config_eur.json');
    expect(providersConfigPath('CHF/JPY')).toBe('/providers_config_chf.json');
  });

  it('全通貨が互いに違うファイルを指す', () => {
    const hist = CURRENCIES.map((c) => masterHistoryPath(c.code));
    expect(new Set(hist).size).toBe(hist.length);
    const cfg = CURRENCIES.map((c) => providersConfigPath(c.code));
    expect(new Set(cfg).size).toBe(cfg.length);
  });

  it('slug が重複していない', () => {
    const slugs = CURRENCIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('未知のコードは従来どおり TRY に落ちる（挙動を変えない）', () => {
    expect(masterHistoryPath('XXX/YYY')).toBe('/data/master_history_try.csv');
    expect(providersConfigPath('XXX/YYY')).toBe('/providers_config.json');
  });
});
